import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const req: Request = context.switchToHttp().getRequest();
    // const token = req.headers.authorization;
    // console.log(token)
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!isPublic) {
      throw new UnauthorizedException('Unauthorized access');
    }
    // throw new Error("Method not implemented.");
    return true;
  }
}
