import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { registerUserDto } from './dto/register.dto';
import { ResponseBuilder } from 'src/response';
import { LoginDto } from './dto/login.dto';
import { AllowAnonymous } from './decorators/allowAnonymous.decorator';
import { validateTokenDto } from './dto/validate-token.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('register')
  @AllowAnonymous()
  async register(@Body() data: registerUserDto) {
    const userCreated = await this.userService.register(data);
    return ResponseBuilder.created(userCreated, 'User registered successfully');
  }

  /**
   * User login
   * @route POST /users/login
   * @access Public
   */
  @Post('login')
  @AllowAnonymous()
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<any> {
    const result = await this.userService.login(loginDto);
    return ResponseBuilder.success(result, 'Login successful');
  }

  @Post('validate-token')
  @AllowAnonymous()
  @HttpCode(HttpStatus.OK)
  async validateToken(@Body() validateTokenDto: validateTokenDto) {
    const result = await this.userService.validateToken(validateTokenDto);
    return ResponseBuilder.success(result, "validated SuccessFully")
  }
}
