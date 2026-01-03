
/**
 * UserService - Manages all user-related operations for the casino platform
 *
 * Methods Overview:
 *
 * CREATE & REGISTRATION:
 * - create() - Creates new user account with email/username validation and referral tracking
 *
 * READ OPERATIONS:
 * - findAll() - Retrieves paginated list of users
 * - findById() - Finds user by unique ID
 * - findByEmail() - Finds user by email (includes password for authentication)
 * - findByUsername() - Finds user by username
 * - findByReferralCode() - Finds user by their referral code
 *
 * UPDATE OPERATIONS:
 * - update() - Updates user profile information
 * - updatePassword() - Changes user password with automatic hashing
 * - updateRole() - Changes user role (USER/VIP/ADMIN)
 * - updateStatus() - Updates account status (ACTIVE/SUSPENDED/BANNED/PENDING)
 *
 * VERIFICATION:
 * - verifyEmail() - Marks email as verified and activates pending accounts
 * - verifyPhone() - Marks phone number as verified
 * - verifyKyc() - Marks KYC (Know Your Customer) as verified
 *
 * WALLET & BALANCE:
 * - getBalance() - Retrieves current balance, bonus balance, and currency
 * - deposit() - Adds funds to user account with validation
 * - withdraw() - Removes funds from account (requires KYC)
 * - addBonus() - Adds bonus balance to user account
 * - processWager() - Deducts wager amount from balance, tracks stats, awards VIP points
 * - processWin() - Records win and adds amount to balance
 * - processLoss() - Records loss in user statistics
 *
 * RESPONSIBLE GAMING:
 * - updateDepositLimits() - Sets daily/weekly/monthly deposit limits
 * - selfExclude() - Temporarily suspends account for responsible gaming
 * - removeSelfExclusion() - Removes self-exclusion after period ends
 *
 * SECURITY & AUTHENTICATION:
 * - updateRefreshToken() - Stores/removes JWT refresh token
 * - recordLogin() - Updates last login timestamp and IP address
 * - recordFailedLogin() - Tracks failed attempts and locks account after 5 failures
 * - isAccountLocked() - Checks if account is currently locked
 * - unlockAccount() - Manually unlocks a locked account
 * - enable2FA() - Enables two-factor authentication
 * - disable2FA() - Disables two-factor authentication
 *
 * STATISTICS & ANALYTICS:
 * - getUserStats() - Returns comprehensive gaming statistics and win rates
 * - getTopPlayers() - Gets leaderboard of top players by total winnings
 *
 * DATA MANAGEMENT:
 * - softDelete() - Marks user as deleted without removing from database
 * - restore() - Restores soft-deleted user account
 * - permanentDelete() - Permanently removes user from database
 */


import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Users, UserRole, AccountStatus, CurrencyType } from './user.entity';
import {
  CreateUserDto,
  UpdateUserDto,
  UpdateDepositLimitsDto,
} from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  // Create & Registration
  async create(createUserDto: CreateUserDto): Promise<Users> {
    // Check if email or username already exists
    const existingUserByEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email, deletedAt: IsNull() },
    });

    if (existingUserByEmail) {
      throw new ConflictException('Email already exists');
    }

    const existingUserByUsername = await this.userRepository.findOne({
      where: { username: createUserDto.username, deletedAt: IsNull() },
    });

    if (existingUserByUsername) {
      throw new ConflictException('Username already exists');
    }

    // Handle referral
    if (createUserDto.referredBy) {
      const referrer = await this.findByReferralCode(createUserDto.referredBy);
      if (referrer) {
        referrer.totalReferrals += 1;
        referrer.addVipPoints(100);
        await this.userRepository.save(referrer);
      }
    }

    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async login() {}

  // Read Operations
  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ users: Users[]; total: number }> {
    const [users, total] = await this.userRepository.findAndCount({
      where: { deletedAt: IsNull() },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { users, total };
  }

  async findById(id: string): Promise<Users> {
    const user = await this.userRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<Users> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .andWhere('user.deletedAt IS NULL')
      .addSelect('user.password')
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByUsername(username: string): Promise<Users> {
    const user = await this.userRepository.findOne({
      where: { username, deletedAt: IsNull() },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByReferralCode(referralCode: string): Promise<Users | null> {
    return await this.userRepository.findOne({
      where: { referralCode, deletedAt: IsNull() },
    });
  }

  // Update Operations
  async update(id: string, updateUserDto: UpdateUserDto): Promise<Users> {
    const user = await this.findById(id);
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    const user = await this.findById(id);
    user.password = newPassword;
    await this.userRepository.save(user);
  }

  async updateRole(id: string, role: UserRole): Promise<Users> {
    const user = await this.findById(id);
    user.role = role;
    return await this.userRepository.save(user);
  }

  async updateStatus(id: string, status: AccountStatus): Promise<Users> {
    const user = await this.findById(id);
    user.status = status;
    return await this.userRepository.save(user);
  }

  // Verification
  async verifyEmail(id: string): Promise<Users> {
    const user = await this.findById(id);
    user.isEmailVerified = true;

    if (user.status === AccountStatus.PENDING_VERIFICATION) {
      user.status = AccountStatus.ACTIVE;
    }

    return await this.userRepository.save(user);
  }

  async verifyPhone(id: string): Promise<Users> {
    const user = await this.findById(id);
    user.isPhoneVerified = true;
    return await this.userRepository.save(user);
  }

  async verifyKyc(id: string): Promise<Users> {
    const user = await this.findById(id);
    user.isKycVerified = true;
    return await this.userRepository.save(user);
  }

  // Wallet & Balance Management
  async getBalance(
    id: string,
  ): Promise<{ balance: number; bonusBalance: number; currency: string }> {
    const user = await this.findById(id);
    return {
      balance: Number(user.balance),
      bonusBalance: Number(user.bonusBalance),
      currency: user.currency,
    };
  }

  async deposit(id: string, amount: number): Promise<Users> {
    if (amount <= 0) {
      throw new BadRequestException('Deposit amount must be positive');
    }

    const user = await this.findById(id);

    if (!user.canDeposit(amount)) {
      throw new BadRequestException('Deposit not allowed');
    }

    user.updateBalance(amount);
    return await this.userRepository.save(user);
  }

  async withdraw(id: string, amount: number): Promise<Users> {
    if (amount <= 0) {
      throw new BadRequestException('Withdrawal amount must be positive');
    }

    const user = await this.findById(id);

    if (Number(user.balance) < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    if (!user.isKycVerified) {
      throw new BadRequestException(
        'KYC verification required for withdrawals',
      );
    }

    user.updateBalance(-amount);
    return await this.userRepository.save(user);
  }

  async addBonus(id: string, amount: number): Promise<Users> {
    const user = await this.findById(id);
    user.updateBonusBalance(amount);
    return await this.userRepository.save(user);
  }

  async processWager(id: string, amount: number): Promise<Users> {
    if (amount <= 0) {
      throw new BadRequestException('Wager amount must be positive');
    }

    const user = await this.findById(id);
    const totalBalance = Number(user.balance) + Number(user.bonusBalance);

    if (totalBalance < amount) {
      throw new BadRequestException('Insufficient funds for wager');
    }

    // Deduct from regular balance first, then bonus
    if (Number(user.balance) >= amount) {
      user.updateBalance(-amount);
    } else {
      const remainingAmount = amount - Number(user.balance);
      user.updateBalance(-Number(user.balance));
      user.updateBonusBalance(-remainingAmount);
    }

    user.incrementGamesPlayed();
    user.updateWageredAmount(amount);
    user.addVipPoints(Math.floor(amount));

    return await this.userRepository.save(user);
  }

  async processWin(id: string, amount: number): Promise<Users> {
    const user = await this.findById(id);
    user.recordWin(amount);
    return await this.userRepository.save(user);
  }

  async processLoss(id: string, amount: number): Promise<Users> {
    const user = await this.findById(id);
    user.recordLoss(amount);
    return await this.userRepository.save(user);
  }

  // Responsible Gaming
  async updateDepositLimits(
    id: string,
    limits: UpdateDepositLimitsDto,
  ): Promise<Users> {
    const user = await this.findById(id);

    if (limits.dailyDepositLimit !== undefined) {
      user.dailyDepositLimit = limits.dailyDepositLimit;
    }
    if (limits.weeklyDepositLimit !== undefined) {
      user.weeklyDepositLimit = limits.weeklyDepositLimit;
    }
    if (limits.monthlyDepositLimit !== undefined) {
      user.monthlyDepositLimit = limits.monthlyDepositLimit;
    }

    return await this.userRepository.save(user);
  }

  async selfExclude(id: string, durationInDays: number): Promise<Users> {
    const user = await this.findById(id);
    user.selfExcluded = true;
    user.selfExclusionUntil = new Date(
      Date.now() + durationInDays * 24 * 60 * 60 * 1000,
    );
    user.status = AccountStatus.SUSPENDED;
    return await this.userRepository.save(user);
  }

  async removeSelfExclusion(id: string): Promise<Users> {
    const user = await this.findById(id);

    if (user.selfExclusionUntil && new Date() < user.selfExclusionUntil) {
      throw new BadRequestException('Self-exclusion period has not ended');
    }

    user.selfExcluded = false;
    user.selfExclusionUntil = undefined;
    user.status = AccountStatus.ACTIVE;
    return await this.userRepository.save(user);
  }

  // Security & Authentication
  async updateRefreshToken(
    id: string,
    refreshToken: string | undefined,
  ): Promise<void> {
    const user = await this.findById(id);
    user.refreshToken = refreshToken;
    await this.userRepository.save(user);
  }

  async recordLogin(id: string, ip: string): Promise<Users> {
    const user = await this.findById(id);
    user.updateLastLogin(ip);
    user.resetFailedLogin();
    return await this.userRepository.save(user);
  }

  async recordFailedLogin(email: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email, deletedAt: IsNull() },
    });

    if (user) {
      user.incrementFailedLogin();
      await this.userRepository.save(user);
    }
  }

  async isAccountLocked(id: string): Promise<boolean> {
    const user = await this.findById(id);
    return user.isAccountLocked();
  }

  async unlockAccount(id: string): Promise<Users> {
    const user = await this.findById(id);
    user.resetFailedLogin();
    return await this.userRepository.save(user);
  }

  async enable2FA(id: string, secret: string): Promise<Users> {
    const user = await this.findById(id);
    user.twoFactorSecret = secret;
    user.twoFactorEnabled = true;
    return await this.userRepository.save(user);
  }

  async disable2FA(id: string): Promise<Users> {
    const user = await this.findById(id);
    user.twoFactorSecret = undefined;
    user.twoFactorEnabled = false;
    return await this.userRepository.save(user);
  }

  // Statistics & Analytics
  async getUserStats(id: string): Promise<{
    totalGamesPlayed: number;
    totalWagered: string;
    totalWon: string;
    totalLost: string;
    profitLoss: string;
    winRate: string;
    vipPoints: number;
    level: number;
  }> {
    const user = await this.findById(id);

    const totalWagered = Number(user.totalWagered);
    const totalWon = Number(user.totalWon);
    const totalLost = Number(user.totalLost);

    const winRate = totalWagered > 0 ? (totalWon / totalWagered) * 100 : 0;

    const profitLoss = totalWon - totalLost;

    return {
      totalGamesPlayed: user.totalGamesPlayed,
      totalWagered: totalWagered.toFixed(2),
      totalWon: totalWon.toFixed(2),
      totalLost: totalLost.toFixed(2),
      profitLoss: profitLoss.toFixed(2),
      winRate: winRate.toFixed(2),
      vipPoints: user.vipPoints,
      level: user.level,
    };
  }

  async getTopPlayers(limit: number = 10): Promise<Users[]> {
    return await this.userRepository.find({
      where: { deletedAt: IsNull() },
      order: { totalWon: 'DESC' },
      take: limit,
      select: {
        id: true,
        username: true,
        avatar: true,
        totalWon: true,
        level: true,
        vipPoints: true,
      },
    });
  }

  // Soft Delete
  async softDelete(id: string): Promise<void> {
    const user = await this.findById(id);
    user.deletedAt = new Date();
    user.status = AccountStatus.BANNED;
    await this.userRepository.save(user);
  }

  async restore(id: string): Promise<Users> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.deletedAt = undefined;
    user.status = AccountStatus.ACTIVE;
    return await this.userRepository.save(user);
  }

  // Permanent Delete
  async permanentDelete(id: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.remove(user);
  }
}
