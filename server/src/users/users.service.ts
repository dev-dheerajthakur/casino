import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountStatus, Users } from './user.entity';
import { Repository } from 'typeorm';
import { registerUserDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { validateTokenDto } from './dto/validate-token.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}

  private validateUser(user: Users) {

    // // Check if account is locked
    if (user.isAccountLocked()) {
      throw new UnauthorizedException(
        'Account is temporarily locked due to too many failed login attempts. Please try again later.',
      );
    }

    // Check account status
    if (user.status === AccountStatus.BANNED) {
      throw new UnauthorizedException('Your account has been banned');
    }

    if (user.status === AccountStatus.SUSPENDED) {
      throw new UnauthorizedException('Your account has been suspended');
    }

    // // Check self-exclusion
    // if (user.selfExcluded && user.selfExclusionUntil) {
    //   if (new Date() < user.selfExclusionUntil) {
    //     throw new UnauthorizedException(
    //       `Your account is self-excluded until ${user.selfExclusionUntil.toDateString()}`,
    //     );
    //   } else {
    //     // Auto-remove expired self-exclusion
    //     await this.removeSelfExclusion(user.id);
    //   }
    // }
  }

  async register(data: registerUserDto) {
    /**
     * check if user with email or username already exists
     **/
    const password = data.password;
    const existingUser = await this.userRepository.findOne({
      where: [{ email: data.email }, { username: data.username }],
    });

    if (existingUser) {
      throw new ConflictException(
        'User with this email or username already exists',
      );
    }

    const user = this.userRepository.create(data);
    await this.userRepository.save(user);
    return await this.login({emailOrUsername: data.email, password})
    // return await this.jwtService.signAsync(user.getJwtPayload());
  }

  /**
   * User Login
   * Authenticates user with email/username and password
   * Handles 2FA verification if enabled
   * Records login attempt and generates JWT tokens
   */
  async login(
    loginDto: LoginDto
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const { emailOrUsername, password, twoFactorCode } = loginDto;

    // Find user by email or username

    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: emailOrUsername })
      .orWhere('user.username = :username', { username: emailOrUsername })
      .andWhere('user.deletedAt IS NULL')
      .addSelect('user.password')
      .addSelect('user.twoFactorSecret')
      .getOne();

    if (!user) throw new UnauthorizedException('Invalid credentials');
    this.validateUser(user);

    // // Verify password
    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      // await this.recordFailedLogin(emailOrUsername);
      throw new UnauthorizedException('Invalid credentials');
    }
    // // Generate JWT tokens
    const payload = user.getJwtPayload();
    const accessToken = await this.jwtService.signAsync(payload, { expiresIn: 3600 });
    const refreshToken = await this.jwtService.signAsync(payload, { expiresIn: 3600*24*10 });

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateToken (validateTokenDto: validateTokenDto): Promise<{isValidToken: boolean, parsedToken: any}> {
    try {
      const parsedToken = await this.jwtService.verifyAsync(validateTokenDto.token)
      return { isValidToken: true, parsedToken }
    } catch (error) {
      throw new UnauthorizedException("inValid Token")
    }
  }

}
