import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Get()
  df() {
    return { success: "auth true" }
  }
}
