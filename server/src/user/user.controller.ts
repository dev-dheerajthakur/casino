import { Body, Controller, Post } from '@nestjs/common';
import { createUserDto, loginUserDto } from './user.dto';

@Controller('user')
export class UserController {
  @Post('/register')
  registerUser(@Body() data: createUserDto) {}

  @Post('/login')
  loginUser(@Body() data: loginUserDto) {}
}
