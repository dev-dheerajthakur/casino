/**
 * API Response Types
 * Standardized response structure for all API endpoints
 * 
 * RESPONSE FORMAT:
 * All endpoints return responses in this consistent format:
 * {
 *   success: boolean,
 *   message?: string,
 *   data?: T,
 *   error?: ErrorDetail,
 *   meta?: MetaData
 * }
 */

// ==================================================================================
// BASE RESPONSE TYPES
// ==================================================================================

/**
 * Base API Response structure
 * All API responses follow this format
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: ErrorDetail;
  meta?: MetaData;
}

/**
 * Success Response
 * Used when operation completes successfully
 */
export interface SuccessResponse<T = any> {
  success: true;
  message?: string;
  data?: T;
  meta?: MetaData;
}

/**
 * Error Response
 * Used when operation fails
 */
export interface ErrorResponse {
  success: false;
  message: string;
  error: ErrorDetail;
}

/**
 * Error Detail structure
 */
export interface ErrorDetail {
  code: string;
  details?: string | string[];
  statusCode: number;
  timestamp?: string;
  path?: string;
  validationErrors?: ValidationError[];
}

/**
 * Validation Error structure
 */
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

/**
 * Meta data for pagination and additional info
 */
export interface MetaData {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  timestamp?: string;
  [key: string]: any;
}

// ==================================================================================
// PAGINATED RESPONSE
// ==================================================================================

/**
 * Paginated Response
 * Used for list endpoints with pagination
 */
export interface PaginatedResponse<T> {
  success: true;
  message?: string;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// ==================================================================================
// SPECIFIC RESPONSE TYPES
// ==================================================================================

/**
 * No Content Response (204)
 * Used for successful operations that don't return data
 */
export interface NoContentResponse {
  success: true;
  message: string;
}

/**
 * Created Response (201)
 * Used when a new resource is created
 */
export interface CreatedResponse<T> {
  success: true;
  message: string;
  data: T;
}

/**
 * Deleted Response
 * Used when a resource is deleted
 */
export interface DeletedResponse {
  success: true;
  message: string;
}

/**
 * Updated Response
 * Used when a resource is updated
 */
export interface UpdatedResponse<T> {
  success: true;
  message: string;
  data: T;
}

// ==================================================================================
// HTTP STATUS CODES
// ==================================================================================

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
}

// ==================================================================================
// ERROR CODES
// ==================================================================================

export enum ErrorCode {
  // Authentication & Authorization
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  
  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  
  // Resource
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  CONFLICT = 'CONFLICT',
  
  // User specific
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  USERNAME_ALREADY_EXISTS = 'USERNAME_ALREADY_EXISTS',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  ACCOUNT_SUSPENDED = 'ACCOUNT_SUSPENDED',
  ACCOUNT_BANNED = 'ACCOUNT_BANNED',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  KYC_NOT_VERIFIED = 'KYC_NOT_VERIFIED',
  
  // Wallet & Balance
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  INSUFFICIENT_BONUS_BALANCE = 'INSUFFICIENT_BONUS_BALANCE',
  DEPOSIT_LIMIT_EXCEEDED = 'DEPOSIT_LIMIT_EXCEEDED',
  WITHDRAWAL_NOT_ALLOWED = 'WITHDRAWAL_NOT_ALLOWED',
  INVALID_AMOUNT = 'INVALID_AMOUNT',
  
  // Gaming
  GAME_NOT_FOUND = 'GAME_NOT_FOUND',
  INVALID_WAGER = 'INVALID_WAGER',
  GAME_SESSION_EXPIRED = 'GAME_SESSION_EXPIRED',
  
  // Rate Limiting
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  
  // Server
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}

// ==================================================================================
// RESPONSE BUILDER HELPERS
// ==================================================================================

/**
 * Helper class to build standardized API responses
 */
export class ResponseBuilder {
  /**
   * Build success response
   */
  static success<T>(data?: T, message?: string, meta?: MetaData): SuccessResponse<T> {
    return {
      success: true,
      message: message || 'Operation completed successfully',
      data,
      meta,
    };
  }

  /**
   * Build created response (201)
   */
  static created<T>(data: T, message?: string): CreatedResponse<T> {
    return {
      success: true,
      message: message || 'Resource created successfully',
      data,
    };
  }

  /**
   * Build no content response (204)
   */
  static noContent(message?: string): NoContentResponse {
    return {
      success: true,
      message: message || 'Operation completed successfully',
    };
  }

  /**
   * Build updated response
   */
  static updated<T>(data: T, message?: string): UpdatedResponse<T> {
    return {
      success: true,
      message: message || 'Resource updated successfully',
      data,
    };
  }

  /**
   * Build deleted response
   */
  static deleted(message?: string): DeletedResponse {
    return {
      success: true,
      message: message || 'Resource deleted successfully',
    };
  }

  /**
   * Build paginated response
   */
  static paginated<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message?: string,
  ): PaginatedResponse<T> {
    const totalPages = Math.ceil(total / limit);
    return {
      success: true,
      message: message || 'Data retrieved successfully',
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  /**
   * Build error response
   */
  static error(
    message: string,
    errorCode: ErrorCode,
    statusCode: HttpStatusCode,
    details?: string | string[],
    validationErrors?: ValidationError[],
  ): ErrorResponse {
    return {
      success: false,
      message,
      error: {
        code: errorCode,
        details,
        statusCode,
        timestamp: new Date().toISOString(),
        validationErrors,
      },
    };
  }

  /**
   * Build validation error response
   */
  static validationError(
    validationErrors: ValidationError[],
    message?: string,
  ): ErrorResponse {
    return {
      success: false,
      message: message || 'Validation failed',
      error: {
        code: ErrorCode.VALIDATION_ERROR,
        statusCode: HttpStatusCode.UNPROCESSABLE_ENTITY,
        timestamp: new Date().toISOString(),
        validationErrors,
      },
    };
  }

  /**
   * Build not found error response
   */
  static notFound(resource: string, message?: string): ErrorResponse {
    return {
      success: false,
      message: message || `${resource} not found`,
      error: {
        code: ErrorCode.NOT_FOUND,
        statusCode: HttpStatusCode.NOT_FOUND,
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Build unauthorized error response
   */
  static unauthorized(message?: string): ErrorResponse {
    return {
      success: false,
      message: message || 'Unauthorized access',
      error: {
        code: ErrorCode.UNAUTHORIZED,
        statusCode: HttpStatusCode.UNAUTHORIZED,
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Build forbidden error response
   */
  static forbidden(message?: string): ErrorResponse {
    return {
      success: false,
      message: message || 'Access forbidden',
      error: {
        code: ErrorCode.FORBIDDEN,
        statusCode: HttpStatusCode.FORBIDDEN,
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Build conflict error response
   */
  static conflict(message: string, details?: string): ErrorResponse {
    return {
      success: false,
      message,
      error: {
        code: ErrorCode.CONFLICT,
        statusCode: HttpStatusCode.CONFLICT,
        timestamp: new Date().toISOString(),
        details,
      },
    };
  }

  /**
   * Build insufficient balance error response
   */
  static insufficientBalance(message?: string): ErrorResponse {
    return {
      success: false,
      message: message || 'Insufficient balance',
      error: {
        code: ErrorCode.INSUFFICIENT_BALANCE,
        statusCode: HttpStatusCode.BAD_REQUEST,
        timestamp: new Date().toISOString(),
      },
    };
  }
}