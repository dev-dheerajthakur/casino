
/**
 * User Entity - Core user model for casino platform
 * 
 * ENUMS:
 * - UserRole          - USER, VIP, ADMIN role types
 * - AccountStatus     - ACTIVE, SUSPENDED, BANNED, PENDING_VERIFICATION
 * - CurrencyType      - USD, EUR, GBP, BTC, ETH
 * 
 * PROPERTIES:
 * 
 * AUTHENTICATION:
 * - id                - Unique UUID identifier
 * - email             - Unique email address
 * - username          - Unique username
 * - password          - Hashed password (excluded from queries by default)
 * 
 * PROFILE INFORMATION:
 * - firstName         - User's first name
 * - lastName          - User's last name
 * - dateOfBirth       - Date of birth for age verification
 * - phoneNumber       - Contact phone number
 * - country           - User's country
 * - avatar            - Profile picture URL
 * 
 * ACCOUNT MANAGEMENT:
 * - role              - User role (USER/VIP/ADMIN)
 * - status            - Account status (ACTIVE/SUSPENDED/BANNED/PENDING)
 * - isEmailVerified   - Email verification status
 * - isPhoneVerified   - Phone verification status
 * - isKycVerified     - KYC (Know Your Customer) verification status
 * 
 * WALLET & BALANCE:
 * - balance           - Main account balance (decimal 15,2)
 * - bonusBalance      - Bonus/promotional balance (decimal 15,2)
 * - currency          - Account currency type
 * 
 * GAMING STATISTICS:
 * - totalGamesPlayed  - Total number of games played
 * - totalWagered      - Total amount wagered (decimal 15,2)
 * - totalWon          - Total amount won (decimal 15,2)
 * - totalLost         - Total amount lost (decimal 15,2)
 * - vipPoints         - VIP loyalty points
 * - level             - User level (based on VIP points)
 * 
 * RESPONSIBLE GAMING:
 * - dailyDepositLimit - Maximum daily deposit allowed
 * - weeklyDepositLimit- Maximum weekly deposit allowed
 * - monthlyDepositLimit- Maximum monthly deposit allowed
 * - selfExcluded      - Self-exclusion status
 * - selfExclusionUntil- Self-exclusion end date
 * 
 * SECURITY:
 * - refreshToken      - JWT refresh token (excluded from queries)
 * - twoFactorSecret   - 2FA secret key
 * - twoFactorEnabled  - 2FA enabled status
 * - lastLoginAt       - Last successful login timestamp
 * - lastLoginIp       - Last login IP address
 * - failedLoginAttempts- Failed login counter
 * - lockedUntil       - Account lock expiration (after 5 failed attempts)
 * 
 * REFERRAL SYSTEM:
 * - referralCode      - User's unique referral code
 * - referredBy        - Referral code of referrer
 * - totalReferrals    - Number of successful referrals
 * 
 * NOTIFICATIONS:
 * - emailNotifications- Email notification preference
 * - smsNotifications  - SMS notification preference
 * - promotionalEmails - Marketing email preference
 * 
 * METADATA:
 * - createdAt         - Account creation timestamp
 * - updatedAt         - Last update timestamp
 * - deletedAt         - Soft delete timestamp (null if active)
 * 
 * HOOKS:
 * - @BeforeInsert/@BeforeUpdate hashPassword() - Auto-hash password before save
 * - @BeforeInsert setDefaults()                - Generate referral code on creation
 * 
 * METHODS:
 * - validatePassword()      - Compare plain password with hashed password
 * - generateReferralCode()  - Generate unique 8-character referral code
 * - updateBalance()         - Add/subtract from main balance
 * - updateBonusBalance()    - Add/subtract from bonus balance
 * - incrementGamesPlayed()  - Increment games played counter
 * - updateWageredAmount()   - Add to total wagered amount
 * - recordWin()             - Record win and update balance
 * - recordLoss()            - Record loss in statistics
 * - addVipPoints()          - Add VIP points and check for level up
 * - checkLevelUp()          - Calculate and update user level (1000 points per level)
 * - canDeposit()            - Check if user can make deposit
 * - isAccountLocked()       - Check if account is currently locked
 * - incrementFailedLogin()  - Increment failed attempts (locks after 5)
 * - resetFailedLogin()      - Reset failed attempts and unlock
 * - updateLastLogin()       - Update last login timestamp and IP
 */




import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  USER = 'user',
  VIP = 'vip',
  ADMIN = 'admin',
}

export enum AccountStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  BANNED = 'banned',
  PENDING_VERIFICATION = 'pending_verification',
}

export enum CurrencyType {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  BTC = 'BTC',
  ETH = 'ETH',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Authentication
  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ select: false })
  password: string;

  // Profile Information
  @Column({ length: 50, nullable: true })
  firstName?: string;

  @Column({ length: 50, nullable: true })
  lastName?: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Column({ length: 20, nullable: true })
  phoneNumber?: string;

  @Column({ length: 100, nullable: true })
  country?: string;

  @Column({ nullable: true })
  avatar?: string;

  // Account Management
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.PENDING_VERIFICATION,
  })
  status: AccountStatus;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ default: false })
  isPhoneVerified: boolean;

  @Column({ default: false })
  isKycVerified: boolean;

  // Wallet & Balance
  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  balance: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  bonusBalance: number;

  @Column({
    type: 'enum',
    enum: CurrencyType,
    default: CurrencyType.USD,
  })
  currency: CurrencyType;

  // Gaming Statistics
  @Column({ type: 'int', default: 0 })
  totalGamesPlayed: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  totalWagered: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  totalWon: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  totalLost: number;

  @Column({ type: 'int', default: 0 })
  vipPoints: number;

  @Column({ type: 'int', default: 1 })
  level: number;

  // Responsible Gaming
  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
  })
  dailyDepositLimit?: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
  })
  weeklyDepositLimit?: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
  })
  monthlyDepositLimit?: number;

  @Column({ default: false })
  selfExcluded: boolean;

  @Column({ type: 'timestamp', nullable: true })
  selfExclusionUntil?: Date;

  // Security
  @Column({ nullable: true, select: false })
  refreshToken?: string;

  @Column({ nullable: true })
  twoFactorSecret?: string;

  @Column({ default: false })
  twoFactorEnabled: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt?: Date;

  @Column({ nullable: true })
  lastLoginIp?: string;

  @Column({ type: 'int', default: 0 })
  failedLoginAttempts: number;

  @Column({ type: 'timestamp', nullable: true })
  lockedUntil?: Date | null;

  // Referral System
  @Column({ nullable: true })
  referralCode?: string;

  @Column({ nullable: true })
  referredBy?: string;

  @Column({ type: 'int', default: 0 })
  totalReferrals: number;

  // Notifications
  @Column({ default: true })
  emailNotifications: boolean;

  @Column({ default: true })
  smsNotifications: boolean;

  @Column({ default: true })
  promotionalEmails: boolean;

  // Metadata
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  // Hooks
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  @BeforeInsert()
  async setDefaults() {
    if (!this.referralCode) {
      this.referralCode = this.generateReferralCode();
    }
  }

  // Methods
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  private generateReferralCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  }

  updateBalance(amount: number): void {
    this.balance = Number(this.balance) + amount;
  }

  updateBonusBalance(amount: number): void {
    this.bonusBalance = Number(this.bonusBalance) + amount;
  }

  incrementGamesPlayed(): void {
    this.totalGamesPlayed += 1;
  }

  updateWageredAmount(amount: number): void {
    this.totalWagered = Number(this.totalWagered) + amount;
  }

  recordWin(amount: number): void {
    this.totalWon = Number(this.totalWon) + amount;
    this.updateBalance(amount);
  }

  recordLoss(amount: number): void {
    this.totalLost = Number(this.totalLost) + amount;
  }

  addVipPoints(points: number): void {
    this.vipPoints += points;
    this.checkLevelUp();
  }

  private checkLevelUp(): void {
    const pointsPerLevel = 1000;
    const newLevel = Math.floor(this.vipPoints / pointsPerLevel) + 1;
    if (newLevel > this.level) {
      this.level = newLevel;
    }
  }

  canDeposit(amount: number): boolean {
    if (this.selfExcluded) return false;
    // Add additional deposit limit checks here
    return true;
  }

  isAccountLocked(): boolean {
    if (!this.lockedUntil) return false;
    return new Date() < this.lockedUntil;
  }

  incrementFailedLogin(): void {
    this.failedLoginAttempts += 1;
    if (this.failedLoginAttempts >= 5) {
      this.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    }
  }

  resetFailedLogin(): void {
    this.failedLoginAttempts = 0;
    this.lockedUntil = null;
  }

  updateLastLogin(ip: string): void {
    this.lastLoginAt = new Date();
    this.lastLoginIp = ip;
  }
}