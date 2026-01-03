// ==================== DTOs ====================
// user.dto.ts (Add these to your existing user.dto.ts file)

import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
  Length,
} from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'Email or username is required' })
  emailOrUsername: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsOptional()
  @IsString()
  @Length(6, 6, { message: 'Two-factor code must be 6 digits' })
  twoFactorCode?: string;
}

export class LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar: string;
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
  };
  expiresIn: number;
}
