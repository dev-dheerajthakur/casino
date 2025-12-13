import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class createUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsNumber()
  phoneNumber: number;

  @IsString()
  countryCode: string;
}

export class loginUserDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsNumber()
  phoneNumber?: number;
}