/**
 * User Endpoint Request/Response Types
 * Complete type definitions for all user API endpoints
 * 
 * This file provides type safety for:
 * - Request parameters (URL params)
 * - Request query strings
 * - Request bodies
 * - Response data structures
 * 
 * Import these types in your frontend/backend for full type safety
 */

import {
  SuccessResponse,
  ErrorResponse,
  PaginatedResponse,
  CreatedResponse,
  UpdatedResponse,
  DeletedResponse,
  NoContentResponse,
} from '../api-response';

// ==================================================================================
// ENUMS & COMMON TYPES
// ==================================================================================

export enum UserRole {
  USER = 'user',
  VIP = 'vip',
  ADMIN = 'admin',
}

export enum AccountStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  BANNED = 'banned',
  PENDING_VERIFICATION = 'pending_verification',
}

export enum CurrencyType {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  BTC = 'BTC',
  ETH = 'ETH',
}

export interface UserData {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: UserRole;
  status: AccountStatus;
  balance: number;
  bonusBalance: number;
  currency: CurrencyType;
  level: number;
  vipPoints: number;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isKycVerified: boolean;
  createdAt: Date | string;
}

// ==================================================================================
// AUTHENTICATION & REGISTRATION
// ==================================================================================

/**
 * POST /users/register
 * Register a new user account
 */
export namespace RegisterEndpoint {
  export interface Request {
    email: string;                    // Valid email format
    username: string;                 // 3-50 characters, alphanumeric
    password: string;                 // Min 8 chars, must include uppercase, lowercase, number
    firstName?: string;               // Max 50 characters
    lastName?: string;                // Max 50 characters
    dateOfBirth?: Date | string;      // ISO date string or Date object
    phoneNumber?: string;             // Valid phone number format
    country?: string;                 // Max 100 characters
    currency?: CurrencyType;          // USD, EUR, GBP, BTC, ETH
    referredBy?: string;              // 8 character referral code
  }

  export type Response = CreatedResponse<UserData>;

  export type Error = ErrorResponse; // Possible errors: EMAIL_ALREADY_EXISTS, USERNAME_ALREADY_EXISTS, VALIDATION_ERROR
}

/**
 * POST /users/login
 * User authentication
 */
export namespace LoginEndpoint {
  export interface Request {
    emailOrUsername: string;          // Email or username
    password: string;                 // User password
    twoFactorCode?: string;           // 6 digit code if 2FA enabled
  }

  export interface ResponseData {
    user: UserData;
    accessToken: string;              // JWT access token
    refreshToken: string;             // JWT refresh token
  }

  export type Response = SuccessResponse<ResponseData>;

  export type Error = ErrorResponse; // Possible errors: INVALID_CREDENTIALS, ACCOUNT_LOCKED, ACCOUNT_SUSPENDED, ACCOUNT_BANNED
}

/**
 * POST /users/logout
 * User logout
 */
export namespace LogoutEndpoint {
  export interface Request {} // No body required

  export type Response = SuccessResponse<null>;

  export type Error = ErrorResponse;
}

// ==================================================================================
// USER PROFILE
// ==================================================================================

/**
 * GET /users
 * Get all users with pagination (Admin only)
 */
export namespace GetAllUsersEndpoint {
  export interface Query {
    page?: number;                    // Page number, default: 1
    limit?: number;                   // Items per page, default: 10, max: 100
  }

  export type Response = PaginatedResponse<UserData>;

  export type Error = ErrorResponse; // Possible errors: UNAUTHORIZED, FORBIDDEN
}

/**
 * GET /users/:id
 * Get user by ID
 */
export namespace GetUserByIdEndpoint {
  export interface Params {
    id: string;                       // UUID format
  }

  export type Response = SuccessResponse<UserData>;

  export type Error = ErrorResponse; // Possible errors: USER_NOT_FOUND, UNAUTHORIZED
}

/**
 * GET /users/profile/me
 * Get current user's profile
 */
export namespace GetMyProfileEndpoint {
  export interface Request {} // No params or body

  export type Response = SuccessResponse<UserData>;

  export type Error = ErrorResponse; // Possible errors: UNAUTHORIZED
}

/**
 * PUT /users/:id
 * Update user profile
 */
export namespace UpdateUserEndpoint {
  export interface Params {
    id: string;                       // UUID format
  }

  export interface Request {
    firstName?: string;               // Max 50 characters
    lastName?: string;                // Max 50 characters
    phoneNumber?: string;             // Valid phone format
    country?: string;                 // Max 100 characters
    avatar?: string;                  // URL format
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    promotionalEmails?: boolean;
  }

  export type Response = UpdatedResponse<UserData>;

  export type Error = ErrorResponse; // Possible errors: USER_NOT_FOUND, UNAUTHORIZED, VALIDATION_ERROR
}

/**
 * PATCH /users/:id/password
 * Change user password
 */
export namespace UpdatePasswordEndpoint {
  export interface Params {
    id: string;                       // UUID format
  }

  export interface Request {
    currentPassword: string;          // Current password
    newPassword: string;              // Min 8 chars, must include uppercase, lowercase, number
  }

  export type Response = SuccessResponse<null>;

  export type Error = ErrorResponse; // Possible errors: INVALID_CREDENTIALS, VALIDATION_ERROR, UNAUTHORIZED
}

/**
 * DELETE /users/:id
 * Soft delete user account
 */
export namespace DeleteUserEndpoint {
  export interface Params {
    id: string;                       // UUID format
  }

  export type Response = DeletedResponse;

  export type Error = ErrorResponse; // Possible errors: USER_NOT_FOUND, UNAUTHORIZED
}

// ==================================================================================
// VERIFICATION
// ==================================================================================

/**
 * POST /users/:id/verify-email
 * Verify user email
 */
export namespace VerifyEmailEndpoint {
  export interface Params {
    id: string;                       // UUID format
  }

  export interface Request {
    token: string;                    // Email verification token
  }

  export type Response = SuccessResponse<UserData>;

  export type Error = ErrorResponse; // Possible errors: INVALID_TOKEN, TOKEN_EXPIRED, USER_NOT_FOUND
}

/**
 * POST /users/:id/verify-phone
 * Verify user phone number
 */
export namespace VerifyPhoneEndpoint {
  export interface Params {
    id: string;                       // UUID format
  }

  export interface Request {
    otp: string;                      // 4-6 digit OTP code
  }

  export type Response = SuccessResponse<UserData>;

  export type Error = ErrorResponse; // Possible errors: INVALID_OTP, USER_NOT_FOUND
}

/**
 * POST /users/:id/verify-kyc
 * Verify user KYC (Admin only)
 */
export namespace VerifyKycEndpoint {
  export interface Params {
    id: string;                       // UUID format
  }

  export type Response = SuccessResponse<UserData>;

  export type Error = ErrorResponse; // Possible errors: USER_NOT_FOUND, UNAUTHORIZED, FORBIDDEN
}

// ==================================================================================
// WALLET & BALANCE
// ==================================================================================

/**
 * GET /users/:id/balance
 * Get user's balance information
 */
export namespace GetBalanceEndpoint {
  export interface Params {
    id: string;                       // UUID format
  }

  export interface ResponseData {
    balance: number;                  // Main account balance
    bonusBalance: number;             // Bonus balance
    currency: CurrencyType;           // Account currency
  }

  export type Response = SuccessResponse<ResponseData>;

  export type Error = ErrorResponse; // Possible errors: USER_NOT_FOUND, UNAUTHORIZED
}

/**
 * POST /users/:id/deposit
 * Deposit funds to user account
 */
export namespace DepositEndpoint {
  export interface Params {
    id: string;                       // UUID format
  }

  export interface Request {
    amount: number;                   // Min: 1, max: depends on limits
    paymentMethod?: string;           // Payment method identifier
    transactionId?: string;           // External transaction ID
  }

  export interface ResponseData {
    balance: number;                  // Updated balance
  }

  export type Response = SuccessResponse<ResponseData>;

  export type Error = ErrorResponse; // Possible errors: INVALID_AMOUNT, DEPOSIT_LIMIT_EXCEEDED, USER_NOT_FOUND
}

/**
 * POST /users/:id/withdraw
 * Withdraw funds from user account
 */
export namespace WithdrawEndpoint {
  export interface Params {
    id: string;                       // UUID format
  }

  export interface Request {
    amount: number;                   // Min: 1, max: user balance
    paymentMethod?: string;           // Payment method identifier
    walletAddress?: string;           // Crypto wallet address if applicable
  }

  export interface ResponseData {
    balance: number;                  // Updated balance
  }

  export type Response = SuccessResponse<ResponseData>;

  export type Error = ErrorResponse; // Possible errors: INSUFFICIENT_BALANCE, KYC_NOT_VERIFIED, INVALID_AMOUNT
}

/**
 * POST /users/:id/bonus
 * Add bonus to user account (Admin only)
 */
export namespace AddBonusEndpoint {
  export interface Params {
    id: string;                       // UUID format
  }

  export interface Request {
    amount: number;                   // Min: 1
    reason?: string;                  // Reason for bonus
    bonusCode?: string;               // Bonus code used
  }

  export interface ResponseData {
    bonusBalance: number;             // Updated bonus balance
  }

  export type Response = SuccessResponse<ResponseData>;

  export type Error = ErrorResponse; // Possible errors: USER_NOT_FOUND, UNAUTHORIZED, FORBIDDEN
}

// ==================================================================================
// GAMING
// ==================================================================================

/**
 * POST /users/:id/wager
 * Process game wager
 */
export namespace ProcessWagerEndpoint {
  export interface Params {
    id: string;                       // UUID format
  }

  export interface Request {
    amount: number;                   // Min: 0.01
    gameId: string;                   // Game identifier
    gameName?: string;                // Game name
  }

  export interface ResponseData {
    balance: number;                  // Updated balance
    bonusBalance: number;             // Updated bonus balance
  }

  export type Response = SuccessResponse<ResponseData>;

  export type Error = ErrorResponse; // Possible errors: INSUFFICIENT_BALANCE, INVALID_WAGER, GAME_NOT_FOUND
}

/**
 * POST /users/:id/game-result
 * Process game result (win/loss)
 */
export namespace ProcessGameResultEndpoint {
  export interface Params {
    id: string;                       // UUID format
  }

  export interface Request {
    gameId: string;                   // Game identifier
    wagerAmount: number;              // Amount wagered
    winAmount: number;                // Amount won (0 if loss)
    isWin: boolean;                   // True if win, false if loss
    gameType?: string;                // Type of game
  }

  export interface ResponseData {
    balance: number;                  // Updated balance
  }

  export type Response = SuccessResponse<ResponseData>;

  export type Error = ErrorResponse; // Possible errors: USER_NOT_FOUND, GAME_NOT_FOUND
}

/**
 * GET /users/:id/stats
 * Get user gaming statistics
 */
export namespace GetUserStatsEndpoint {
  export interface Params {
    id: string;                       // UUID format
  }

  export interface ResponseData {
    totalGamesPlayed: number;         // Total games played
    totalWagered: string;             // Total amount wagered (decimal string)
    totalWon: string;                 // Total amount won (decimal string)
    totalLost: string;                // Total amount lost (decimal string)
    profitLoss: string;               // Net profit/loss (decimal string)
    winRate: string;                  // Win rate percentage (decimal string)
    vipPoints: number;                // Current VIP points
    level: number;                    // Current level
  }

  export type Response = SuccessResponse<ResponseData>;

  export type Error = ErrorResponse; // Possible errors: USER_NOT_FOUND, UNAUTHORIZED
}

/**
 * GET /users/leaderboard/top
 * Get top players leaderboard
 */
export namespace GetTopPlayersEndpoint {
  export interface Query {
    limit?: number;                   // Number of players, default: 10, max: 100
  }

  export type Response = SuccessResponse<UserData[]>;

  export type Error = ErrorResponse;
}

// ==================================================================================
// RESPONSIBLE GAMING
// ==================================================================================

/**
 * PUT /users/:id/deposit-limits
 * Update deposit limits
 */
export namespace UpdateDepositLimitsEndpoint {
  export interface Params {
    id: string;                       // UUID format
  }

  export interface Request {
    dailyDepositLimit?: number;       // Daily limit, min: 0
    weeklyDepositLimit?: number;      // Weekly limit, min: 0
    monthlyDepositLimit?: number;     // Monthly limit, min: 0
  }

  export interface ResponseData {
    limits: Request;                  // Updated limits
  }

  export type Response = SuccessResponse<ResponseData>;

  export type Error = ErrorResponse; // Possible errors: USER_NOT_FOUND, UNAUTHORIZED, VALIDATION_ERROR
}

/**
 * POST /users/:id/self-exclude
 * Self-exclude account
 */
export namespace SelfExcludeEndpoint {
  export interface Params {
    id: string;                       // UUID format
  }

  export interface Request {
    durationInDays: number;           // Min: 1, max: 365
    reason?: string;                  // Reason for self-exclusion
  }

  export interface ResponseData {
    exclusionUntil: Date | string;    // Exclusion end date
  }

  export type Response = SuccessResponse<ResponseData>;

  export type Error = ErrorResponse; // Possible errors: USER_NOT_FOUND, UNAUTHORIZED, VALIDATION_ERROR
}

/**
 * DELETE /users/:id/self-exclude
 * Remove self-exclusion
 */
export namespace RemoveSelfExclusionEndpoint {
  export interface Params {
    id: string;                       // UUID format
  }

  export type Response = SuccessResponse<null>;

  export type Error = ErrorResponse; // Possible errors: USER_NOT_FOUND, SELF_EXCLUSION_ACTIVE
}

// ==================================================================================
// SECURITY
// ==================================================================================

/**
 * POST /users/:id/2fa/enable
 * Enable two-factor authentication
 */
export namespace Enable2FAEndpoint {
  export interface Params {
    id: string;                       // UUID format
  }

  export interface Request {
    secret: string;                   // 2FA secret key
    verificationCode: string;         // 6 digit verification code
  }

  export type Response = SuccessResponse<null>;

  export type Error = ErrorResponse; // Possible errors: INVALID_CODE, USER_NOT_FOUND, UNAUTHORIZED
}

/**
 * DELETE /users/:id/2fa/disable
 * Disable two-factor authentication
 */
export namespace Disable2FAEndpoint {
  export interface Params {
    id: string;                       // UUID format
  }

  export interface Request {
    verificationCode: string;         // 6 digit verification code
  }

  export type Response = SuccessResponse<null>;

  export type Error = ErrorResponse; // Possible errors: INVALID_CODE, USER_NOT_FOUND, UNAUTHORIZED
}

/**
 * POST /users/:id/unlock
 * Unlock locked account (Admin only)
 */
export namespace UnlockAccountEndpoint {
  export interface Params {
    id: string;                       // UUID format
  }

  export type Response = SuccessResponse<null>;

  export type Error = ErrorResponse; // Possible errors: USER_NOT_FOUND, UNAUTHORIZED, FORBIDDEN
}

// ==================================================================================
// ADMIN OPERATIONS
// ==================================================================================

/**
 * PATCH /users/:id/role
 * Update user role (Admin only)
 */
export namespace UpdateRoleEndpoint {
  export interface Params {
    id: string;                       // UUID format
  }

  export interface Request {
    role: UserRole;                   // USER, VIP, or ADMIN
  }

  export type Response = UpdatedResponse<UserData>;

  export type Error = ErrorResponse; // Possible errors: USER_NOT_FOUND, UNAUTHORIZED, FORBIDDEN
}

/**
 * PATCH /users/:id/status
 * Update user status (Admin only)
 */
export namespace UpdateStatusEndpoint {
  export interface Params {
    id: string;                       // UUID format
  }

  export interface Request {
    status: AccountStatus;            // ACTIVE, SUSPENDED, BANNED, PENDING_VERIFICATION
  }

  export type Response = UpdatedResponse<UserData>;

  export type Error = ErrorResponse; // Possible errors: USER_NOT_FOUND, UNAUTHORIZED, FORBIDDEN
}

/**
 * DELETE /users/:id/permanent
 * Permanently delete user (Admin only)
 */
export namespace PermanentDeleteEndpoint {
  export interface Params {
    id: string;                       // UUID format
  }

  export type Response = DeletedResponse;

  export type Error = ErrorResponse; // Possible errors: USER_NOT_FOUND, UNAUTHORIZED, FORBIDDEN
}

/**
 * POST /users/:id/restore
 * Restore soft-deleted user (Admin only)
 */
export namespace RestoreUserEndpoint {
  export interface Params {
    id: string;                       // UUID format
  }

  export type Response = SuccessResponse<UserData>;

  export type Error = ErrorResponse; // Possible errors: USER_NOT_FOUND, UNAUTHORIZED, FORBIDDEN
}

// ==================================================================================
// UNIFIED ENDPOINT MAPPING
// ==================================================================================

/**
 * Complete mapping of all user endpoints
 * Use this for type-safe API calls
 */
export interface UserEndpoints {
  'POST /users/register': RegisterEndpoint;
  'POST /users/login': LoginEndpoint;
  'POST /users/logout': LogoutEndpoint;
  'GET /users': GetAllUsersEndpoint;
  'GET /users/:id': GetUserByIdEndpoint;
  'GET /users/profile/me': GetMyProfileEndpoint;
  'PUT /users/:id': UpdateUserEndpoint;
  'PATCH /users/:id/password': UpdatePasswordEndpoint;
  'DELETE /users/:id': DeleteUserEndpoint;
  'POST /users/:id/verify-email': VerifyEmailEndpoint;
  'POST /users/:id/verify-phone': VerifyPhoneEndpoint;
  'POST /users/:id/verify-kyc': VerifyKycEndpoint;
  'GET /users/:id/balance': GetBalanceEndpoint;
  'POST /users/:id/deposit': DepositEndpoint;
  'POST /users/:id/withdraw': WithdrawEndpoint;
  'POST /users/:id/bonus': AddBonusEndpoint;
  'POST /users/:id/wager': ProcessWagerEndpoint;
  'POST /users/:id/game-result': ProcessGameResultEndpoint;
  'GET /users/:id/stats': GetUserStatsEndpoint;
  'GET /users/leaderboard/top': GetTopPlayersEndpoint;
  'PUT /users/:id/deposit-limits': UpdateDepositLimitsEndpoint;
  'POST /users/:id/self-exclude': SelfExcludeEndpoint;
  'DELETE /users/:id/self-exclude': RemoveSelfExclusionEndpoint;
  'POST /users/:id/2fa/enable': Enable2FAEndpoint;
  'DELETE /users/:id/2fa/disable': Disable2FAEndpoint;
  'POST /users/:id/unlock': UnlockAccountEndpoint;
  'PATCH /users/:id/role': UpdateRoleEndpoint;
  'PATCH /users/:id/status': UpdateStatusEndpoint;
  'DELETE /users/:id/permanent': PermanentDeleteEndpoint;
  'POST /users/:id/restore': RestoreUserEndpoint;
}

// ==================================================================================
// USAGE EXAMPLES
// ==================================================================================

/**
 * Frontend Usage Example:
 * 
 * ```typescript
 * import { RegisterEndpoint } from './user-endpoint.types';
 * 
 * // Type-safe request
 * const registerData: RegisterEndpoint.Request = {
 *   email: 'user@example.com',
 *   username: 'player123',
 *   password: 'SecurePass123',
 *   currency: CurrencyType.USD
 * };
 * 
 * // Type-safe response
 * const response: RegisterEndpoint.Response = await api.post('/users/register', registerData);
 * 
 * if (response.success) {
 *   console.log(response.data.id); // TypeScript knows this exists!
 * } else {
 *   console.error(response.error.code); // Type-safe error handling
 * }
 * ```
 * 
 * Backend Usage Example:
 * 
 * ```typescript
 * import { RegisterEndpoint } from './user-endpoint.types';
 * 
 * @Post('register')
 * async register(
 *   @Body() body: RegisterEndpoint.Request
 * ): Promise<RegisterEndpoint.Response> {
 *   // Implementation
 * }
 * ```
 */