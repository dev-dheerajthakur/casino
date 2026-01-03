import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Rate Limiter for Casino Backend
 * 
 * FEATURES:
 * - IP-based rate limiting
 * - User-based rate limiting (for authenticated requests)
 * - Different limits for different endpoint types
 * - Configurable time windows and request limits
 * - Clean-up of expired entries
 * - Response headers with rate limit info
 * 
 * RATE LIMIT TIERS:
 * - STRICT   - 5 requests per minute (login, registration, password reset)
 * - MODERATE - 20 requests per minute (deposits, withdrawals, KYC)
 * - STANDARD - 60 requests per minute (profile updates, general API)
 * - GENEROUS - 120 requests per minute (game actions, stats, leaderboard)
 * 
 * USAGE:
 * Apply to specific routes in your module or globally in main.ts
 * 
 * Global Application (main.ts):
 * ```typescript
 * app.use(new RateLimiterMiddleware().use);
 * ```
 * 
 * Route-specific (in controller):
 * ```typescript
 * @UseGuards(RateLimiterGuard)
 * @RateLimit({ limit: 5, window: 60000 })
 * @Post('login')
 * async login() { ... }
 * ```
 */

// Rate limit configuration interface
interface RateLimitConfig {
  limit: number;  // Max requests
  window: number; // Time window in milliseconds
}

// Rate limit tiers
export const RateLimitTiers = {
  STRICT: { limit: 5, window: 60000 },      // 5 req/min
  MODERATE: { limit: 20, window: 60000 },   // 20 req/min
  STANDARD: { limit: 60, window: 60000 },   // 60 req/min
  GENEROUS: { limit: 120, window: 60000 },  // 120 req/min
};

// Request tracking interface
interface RequestLog {
  count: number;
  resetTime: number;
}

/**
 * Rate Limiter Middleware
 * Tracks requests by IP and user ID
 */
@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  private requestLog: Map<string, RequestLog> = new Map();
  private readonly cleanupInterval = 60000; // Clean up every minute

  constructor() {
    // Periodically clean up expired entries
    setInterval(() => this.cleanup(), this.cleanupInterval);
  }

  use(req: Request, res: Response, next: NextFunction) {
    const config = this.getConfigForRoute(req.path);
    const identifier = this.getIdentifier(req);
    
    const now = Date.now();
    let log = this.requestLog.get(identifier);

    // Initialize or reset if window expired
    if (!log || now > log.resetTime) {
      log = {
        count: 0,
        resetTime: now + config.window,
      };
      this.requestLog.set(identifier, log);
    }

    // Increment request count
    log.count++;

    // Calculate remaining requests
    const remaining = Math.max(0, config.limit - log.count);
    const resetIn = Math.ceil((log.resetTime - now) / 1000);

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', config.limit.toString());
    res.setHeader('X-RateLimit-Remaining', remaining.toString());
    res.setHeader('X-RateLimit-Reset', resetIn.toString());

    // Check if limit exceeded
    if (log.count > config.limit) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Too many requests. Please try again later.',
          retryAfter: resetIn,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    next();
  }

  /**
   * Get rate limit configuration based on route
   */
  private getConfigForRoute(path: string): RateLimitConfig {
    // Strict limits for sensitive operations
    if (
      path.includes('/login') ||
      path.includes('/register') ||
      path.includes('/password') ||
      path.includes('/2fa')
    ) {
      return RateLimitTiers.STRICT;
    }

    // Moderate limits for financial operations
    if (
      path.includes('/deposit') ||
      path.includes('/withdraw') ||
      path.includes('/bonus') ||
      path.includes('/verify')
    ) {
      return RateLimitTiers.MODERATE;
    }

    // Generous limits for gaming operations
    if (
      path.includes('/wager') ||
      path.includes('/game') ||
      path.includes('/stats') ||
      path.includes('/leaderboard')
    ) {
      return RateLimitTiers.GENEROUS;
    }

    // Standard limit for everything else
    return RateLimitTiers.STANDARD;
  }

  /**
   * Get unique identifier for rate limiting
   * Prioritizes user ID over IP for authenticated requests
   */
  private getIdentifier(req: Request): string {
    // Use user ID if authenticated
    const userId = (req as any).user?.id;
    if (userId) {
      return `user:${userId}`;
    }

    // Fall back to IP address
    const ip = this.getClientIp(req);
    return `ip:${ip}`;
  }

  /**
   * Extract client IP address
   */
  private getClientIp(req: Request): string {
    return (
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      (req.headers['x-real-ip'] as string) ||
      req.socket.remoteAddress ||
      'unknown'
    );
  }

  /**
   * Clean up expired entries from memory
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, log] of this.requestLog.entries()) {
      if (now > log.resetTime) {
        this.requestLog.delete(key);
      }
    }
  }
}

/**
 * Rate Limiter Guard (for route-specific limits)
 * Use with @RateLimit() decorator
 */
import { 
  Injectable as GuardInjectable, 
  CanActivate, 
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const RATE_LIMIT_KEY = 'rateLimit';

/**
 * Decorator to set custom rate limits on specific routes
 * 
 * @example
 * @RateLimit({ limit: 10, window: 60000 })
 * @Post('endpoint')
 * async handler() { ... }
 */
export const RateLimit = (config: RateLimitConfig) =>
  SetMetadata(RATE_LIMIT_KEY, config);

@GuardInjectable()
export class RateLimiterGuard implements CanActivate {
  private requestLog: Map<string, RequestLog> = new Map();

  constructor(private reflector: Reflector) {
    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  canActivate(context: ExecutionContext): boolean {
    const config = this.reflector.get<RateLimitConfig>(
      RATE_LIMIT_KEY,
      context.getHandler(),
    );

    // If no rate limit decorator, allow request
    if (!config) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    const identifier = this.getIdentifier(request);
    const now = Date.now();
    let log = this.requestLog.get(identifier);

    // Initialize or reset if window expired
    if (!log || now > log.resetTime) {
      log = {
        count: 0,
        resetTime: now + config.window,
      };
      this.requestLog.set(identifier, log);
    }

    // Increment request count
    log.count++;

    // Calculate remaining requests
    const remaining = Math.max(0, config.limit - log.count);
    const resetIn = Math.ceil((log.resetTime - now) / 1000);

    // Set rate limit headers
    response.setHeader('X-RateLimit-Limit', config.limit.toString());
    response.setHeader('X-RateLimit-Remaining', remaining.toString());
    response.setHeader('X-RateLimit-Reset', resetIn.toString());

    // Check if limit exceeded
    if (log.count > config.limit) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Too many requests. Please try again later.',
          retryAfter: resetIn,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }

  private getIdentifier(req: any): string {
    const userId = req.user?.id;
    if (userId) {
      return `user:${userId}`;
    }

    const ip = this.getClientIp(req);
    return `ip:${ip}`;
  }

  private getClientIp(req: any): string {
    return (
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.headers['x-real-ip'] ||
      req.socket.remoteAddress ||
      'unknown'
    );
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, log] of this.requestLog.entries()) {
      if (now > log.resetTime) {
        this.requestLog.delete(key);
      }
    }
  }
}

/**
 * Rate Limiter Module
 * Import this in your app.module.ts
 */
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';

@Module({
  providers: [RateLimiterGuard],
  exports: [RateLimiterGuard],
})
export class RateLimiterModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply rate limiter to all routes
    consumer
      .apply(RateLimiterMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

/**
 * IMPLEMENTATION GUIDE:
 * 
 * 1. GLOBAL RATE LIMITING (app.module.ts):
 * ```typescript
 * @Module({
 *   imports: [RateLimiterModule, UserModule, ...],
 * })
 * export class AppModule {}
 * ```
 * 
 * 2. ROUTE-SPECIFIC LIMITS (in controller):
 * ```typescript
 * @UseGuards(RateLimiterGuard)
 * @RateLimit({ limit: 3, window: 60000 }) // 3 requests per minute
 * @Post('login')
 * async login(@Body() loginDto: LoginDto) {
 *   // ...
 * }
 * ```
 * 
 * 3. CUSTOM CONFIGURATION:
 * Modify RateLimitTiers constant to adjust limits:
 * ```typescript
 * export const RateLimitTiers = {
 *   STRICT: { limit: 3, window: 60000 },  // More strict
 *   // ...
 * };
 * ```
 * 
 * RESPONSE HEADERS:
 * - X-RateLimit-Limit: Maximum requests allowed
 * - X-RateLimit-Remaining: Remaining requests in current window
 * - X-RateLimit-Reset: Seconds until rate limit resets
 * 
 * ERROR RESPONSE (429 Too Many Requests):
 * {
 *   "statusCode": 429,
 *   "message": "Too many requests. Please try again later.",
 *   "retryAfter": 45
 * }
 */