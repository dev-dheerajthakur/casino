
/**
 * User DTOs (Data Transfer Objects) - Request/Response validation for casino platform
 * 
 * AUTHENTICATION & REGISTRATION:
 * - CreateUserDto          - New user registration with validation
 * - LoginDto               - User login credentials
 * - ForgotPasswordDto      - Request password reset
 * - ResetPasswordDto       - Reset password with token
 * 
 * PROFILE MANAGEMENT:
 * - UpdateUserDto          - Update user profile information
 * - UpdatePasswordDto      - Change password with current password verification
 * - UserResponseDto        - Safe user data response (excludes sensitive fields)
 * 
 * WALLET OPERATIONS:
 * - DepositDto             - Deposit funds to account
 * - WithdrawDto            - Withdraw funds from account
 * - AddBonusDto            - Add bonus balance (admin)
 * 
 * GAMING:
 * - WagerDto               - Place game wager
 * - GameResultDto          - Process game win/loss result
 * 
 * RESPONSIBLE GAMING:
 * - UpdateDepositLimitsDto - Set daily/weekly/monthly deposit limits
 * - SelfExclusionDto       - Self-exclude account for specified duration
 * 
 * VERIFICATION:
 * - VerifyEmailDto         - Email verification with token
 * - VerifyPhoneDto         - Phone verification with OTP
 * 
 * SECURITY:
 * - Enable2FADto           - Enable two-factor authentication
 * - Disable2FADto          - Disable two-factor authentication
 * 
 * UTILITIES:
 * - PaginationDto          - Query parameters for paginated endpoints
 * 
 * All DTOs include class-validator decorators for automatic request validation
 */


import {
  IsEmail,
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsNumber,
  IsDate,
  MinLength,
  MaxLength,
  Min,
  IsPhoneNumber,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CurrencyType } from './user.entity';

/**
 * DTO for creating a new user account
 */
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Username can only contain letters, numbers, underscores, and hyphens',
  })
  username: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastName?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfBirth?: Date;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @IsOptional()
  @IsEnum(CurrencyType)
  currency?: CurrencyType;

  @IsOptional()
  @IsString()
  @MaxLength(8)
  referredBy?: string;
}

/**
 * DTO for updating user profile information
 */
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastName?: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  smsNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  promotionalEmails?: boolean;
}

/**
 * DTO for updating user password
 */
export class UpdatePasswordDto {
  @IsString()
  @MinLength(8)
  currentPassword: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  newPassword: string;
}

/**
 * DTO for updating deposit limits
 */
export class UpdateDepositLimitsDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  dailyDepositLimit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  weeklyDepositLimit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  monthlyDepositLimit?: number;
}

/**
 * DTO for deposit operations
 */
export class DepositDto {
  @IsNumber()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  transactionId?: string;
}

/**
 * DTO for withdrawal operations
 */
export class WithdrawDto {
  @IsNumber()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  walletAddress?: string;
}

/**
 * DTO for bonus operations
 */
export class AddBonusDto {
  @IsNumber()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  bonusCode?: string;
}

/**
 * DTO for wager operations
 */
export class WagerDto {
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  gameId: string;

  @IsOptional()
  @IsString()
  gameName?: string;
}

/**
 * DTO for processing game results
 */
export class GameResultDto {
  @IsString()
  gameId: string;

  @IsNumber()
  wagerAmount: number;

  @IsNumber()
  @Min(0)
  winAmount: number;

  @IsBoolean()
  isWin: boolean;

  @IsOptional()
  @IsString()
  gameType?: string;
}

/**
 * DTO for self-exclusion
 */
export class SelfExclusionDto {
  @IsNumber()
  @Min(1)
  @MaxLength(365)
  durationInDays: number;

  @IsOptional()
  @IsString()
  reason?: string;
}

/**
 * DTO for login
 */
export class LoginDto {
  @IsString()
  emailOrUsername: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  twoFactorCode?: string;
}

/**
 * DTO for user registration response
 */
export class UserResponseDto {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: string;
  status: string;
  balance: number;
  bonusBalance: number;
  currency: string;
  level: number;
  vipPoints: number;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isKycVerified: boolean;
  createdAt: Date;
}

/**
 * DTO for pagination query parameters
 */
export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @MaxLength(100)
  limit?: number = 10;
}

/**
 * DTO for verifying email with token
 */
export class VerifyEmailDto {
  @IsString()
  token: string;
}

/**
 * DTO for verifying phone with OTP
 */
export class VerifyPhoneDto {
  @IsString()
  @MinLength(4)
  @MaxLength(6)
  otp: string;
}

/**
 * DTO for enabling 2FA
 */
export class Enable2FADto {
  @IsString()
  secret: string;

  @IsString()
  @MinLength(6)
  @MaxLength(6)
  verificationCode: string;
}

/**
 * DTO for disabling 2FA
 */
export class Disable2FADto {
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  verificationCode: string;
}

/**
 * DTO for forgot password
 */
export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

/**
 * DTO for reset password
 */
export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  newPassword: string;
}