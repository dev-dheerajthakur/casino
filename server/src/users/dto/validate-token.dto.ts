import { IsNotEmpty, IsString } from "class-validator";

export class validateTokenDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}