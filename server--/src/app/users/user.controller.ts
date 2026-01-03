/**
 * UserController - Handles all HTTP requests for user management in the casino platform
 * Base Route: /users
 *
 * AUTHENTICATION & REGISTRATION:
 * POST   /users/register              - Register new user account
 * POST   /users/login                 - User login (handled by auth module typically)
 * POST   /users/logout                - User logout
 *
 * USER PROFILE:
 * GET    /users                       - Get all users (paginated, admin only)
 * GET    /users/:id                   - Get user by ID
 * GET    /users/profile/me            - Get current user's profile
 * PUT    /users/:id                   - Update user profile
 * PATCH  /users/:id/password          - Change user password
 * DELETE /users/:id                   - Soft delete user account
 *
 * VERIFICATION:
 * POST   /users/:id/verify-email      - Verify user email
 * POST   /users/:id/verify-phone      - Verify user phone number
 * POST   /users/:id/verify-kyc        - Verify user KYC documents
 *
 * WALLET & BALANCE:
 * GET    /users/:id/balance           - Get user's balance information
 * POST   /users/:id/deposit           - Deposit funds to user account
 * POST   /users/:id/withdraw          - Withdraw funds from user account
 * POST   /users/:id/bonus             - Add bonus to user account (admin only)
 *
 * GAMING:
 * POST   /users/:id/wager             - Process game wager
 * POST   /users/:id/game-result       - Process game result (win/loss)
 * GET    /users/:id/stats             - Get user gaming statistics
 * GET    /users/leaderboard/top       - Get top players leaderboard
 *
 * RESPONSIBLE GAMING:
 * PUT    /users/:id/deposit-limits    - Update deposit limits
 * POST   /users/:id/self-exclude      - Self-exclude account
 * DELETE /users/:id/self-exclude      - Remove self-exclusion
 *
 * SECURITY:
 * POST   /users/:id/2fa/enable        - Enable two-factor authentication
 * DELETE /users/:id/2fa/disable       - Disable two-factor authentication
 * POST   /users/:id/unlock            - Unlock locked account (admin only)
 *
 * ADMIN OPERATIONS:
 * PATCH  /users/:id/role              - Update user role (admin only)
 * PATCH  /users/:id/status            - Update user status (admin only)
 * DELETE /users/:id/permanent         - Permanently delete user (admin only)
 * POST   /users/:id/restore           - Restore soft-deleted user (admin only)
 */

/**
 * UserController - Handles all HTTP requests for user management in the casino platform
 * Base Route: /users
 *
 * ==================================================================================
 * AUTHENTICATION & REGISTRATION
 * ==================================================================================
 *
 * POST /users/register - Register new user account
 * Body: {
 *   email: string (required),
 *   username: string (required, 3-50 chars),
 *   password: string (required, min 8 chars, must include uppercase, lowercase, number),
 *   firstName?: string,
 *   lastName?: string,
 *   dateOfBirth?: Date,
 *   phoneNumber?: string,
 *   country?: string,
 *   currency?: 'USD' | 'EUR' | 'GBP' | 'BTC' | 'ETH',
 *   referredBy?: string (referral code)
 * }
 *
 * POST /users/login - User login (typically handled by auth module)
 * Body: {
 *   emailOrUsername: string (required),
 *   password: string (required),
 *   twoFactorCode?: string (if 2FA enabled)
 * }
 *
 * POST /users/logout - User logout
 * Headers: { Authorization: 'Bearer <token>' }
 *
 * ==================================================================================
 * USER PROFILE
 * ==================================================================================
 *
 * GET /users - Get all users (paginated, admin only)
 * Headers: { Authorization: 'Bearer <token>' }
 * Query: { page?: number (default 1), limit?: number (default 10) }
 *
 * GET /users/:id - Get user by ID
 * Headers: { Authorization: 'Bearer <token>' }
 * Params: { id: string (UUID) }
 *
 * GET /users/profile/me - Get current user's profile
 * Headers: { Authorization: 'Bearer <token>' }
 *
 * PUT /users/:id - Update user profile
 * Headers: { Authorization: 'Bearer <token>' }
 * Params: { id: string (UUID) }
 * Body: {
 *   firstName?: string,
 *   lastName?: string,
 *   phoneNumber?: string,
 *   country?: string,
 *   avatar?: string (URL),
 *   emailNotifications?: boolean,
 *   smsNotifications?: boolean,
 *   promotionalEmails?: boolean
 * }
 *
 * PATCH /users/:id/password - Change user password
 * Headers: { Authorization: 'Bearer <token>' }
 * Params: { id: string (UUID) }
 * Body: {
 *   currentPassword: string (required),
 *   newPassword: string (required, min 8 chars)
 * }
 *
 * DELETE /users/:id - Soft delete user account
 * Headers: { Authorization: 'Bearer <token>' }
 * Params: { id: string (UUID) }
 *
 * ==================================================================================
 * VERIFICATION
 * ==================================================================================
 *
 * POST /users/:id/verify-email - Verify user email
 * Headers: { Authorization: 'Bearer <token>' }
 * Params: { id: string (UUID) }
 * Body: { token: string (verification token) }
 *
 * POST /users/:id/verify-phone - Verify user phone number
 * Headers: { Authorization: 'Bearer <token>' }
 * Params: { id: string (UUID) }
 * Body: { otp: string (4-6 digit code) }
 *
 * POST /users/:id/verify-kyc - Verify user KYC documents (admin only)
 * Headers: { Authorization: 'Bearer <token>' }
 * Params: { id: string (UUID) }
 *
 * ==================================================================================
 * WALLET & BALANCE
 * ==================================================================================
 *
 * GET /users/:id/balance - Get user's balance information
 * Headers: { Authorization: 'Bearer <token>' }
 * Params: { id: string (UUID) }
 *
 * POST /users/:id/deposit - Deposit funds to user account
 * Headers: { Authorization: 'Bearer <token>' }
 * Params: { id: string (UUID) }
 * Body: {
 *   amount: number (required, min 1),
 *   paymentMethod?: string,
 *   transactionId?: string
 * }
 *
 * POST /users/:id/withdraw - Withdraw funds from user account
 * Headers: { Authorization: 'Bearer <token>' }
 * Params: { id: string (UUID) }
 * Body: {
 *   amount: number (required, min 1),
 *   paymentMethod?: string,
 *   walletAddress?: string
 * }
 *
 * POST /users/:id/bonus - Add bonus to user account (admin only)
 * Headers: { Authorization: 'Bearer <token>' }
 * Params: { id: string (UUID) }
 * Body: {
 *   amount: number (required, min 1),
 *   reason?: string,
 *   bonusCode?: string
 * }
 *
 * ==================================================================================
 * GAMING
 * ==================================================================================
 *
 * POST /users/:id/wager - Process game wager
 * Headers: { Authorization: 'Bearer <token>' }
 * Params: { id: string (UUID) }
 * Body: {
 *   amount: number (required, min 0.01),
 *   gameId: string (required),
 *   gameName?: string
 * }
 *
 * POST /users/:id/game-result - Process game result (win/loss)
 * Headers: { Authorization: 'Bearer <token>' }
 * Params: { id: string (UUID) }
 * Body: {
 *   gameId: string (required),
 *   wagerAmount: number (required),
 *   winAmount: number (required, min 0),
 *   isWin: boolean (required),
 *   gameType?: string
 * }
 *
 * GET /users/:id/stats - Get user gaming statistics
 * Headers: { Authorization: 'Bearer <token>' }
 * Params: { id: string (UUID) }
 *
 * GET /users/leaderboard/top - Get top players leaderboard
 * Query: { limit?: number (default 10, max 100) }
 *
 * ==================================================================================
 * RESPONSIBLE GAMING
 * ==================================================================================
 *
 * PUT /users/:id/deposit-limits - Update deposit limits
 * Headers: { Authorization: 'Bearer <token>' }
 * Params: { id: string (UUID) }
 * Body: {
 *   dailyDepositLimit?: number (min 0),
 *   weeklyDepositLimit?: number (min 0),
 *   monthlyDepositLimit?: number (min 0)
 * }
 *
 * POST /users/:id/self-exclude - Self-exclude account
 * Headers: { Authorization: 'Bearer <token>' }
 * Params: { id: string (UUID) }
 * Body: {
 *   durationInDays: number (required, min 1, max 365),
 *   reason?: string
 * }
 *
 * DELETE /users/:id/self-exclude - Remove self-exclusion
 * Headers: { Authorization: 'Bearer <token>' }
 * Params: { id: string (UUID) }
 *
 * ==================================================================================
 * SECURITY
 * ==================================================================================
 *
 * POST /users/:id/2fa/enable - Enable two-factor authentication
 * Headers: { Authorization: 'Bearer <token>' }
 * Params: { id: string (UUID) }
 * Body: {
 *   secret: string (required, 2FA secret),
 *   verificationCode: string (required, 6 digits)
 * }
 *
 * DELETE /users/:id/2fa/disable - Disable two-factor authentication
 * Headers: { Authorization: 'Bearer <token>' }
 * Params: { id: string (UUID) }
 * Body: {
 *   verificationCode: string (required, 6 digits)
 * }
 *
 * POST /users/:id/unlock - Unlock locked account (admin only)
 * Headers: { Authorization: 'Bearer <token>' }
 * Params: { id: string (UUID) }
 *
 * ==================================================================================
 * ADMIN OPERATIONS
 * ==================================================================================
 *
 * PATCH /users/:id/role - Update user role (admin only)
 * Headers: { Authorization: 'Bearer <token>' }
 * Params: { id: string (UUID) }
 * Body: { role: 'user' | 'vip' | 'admin' }
 *
 * PATCH /users/:id/status - Update user status (admin only)
 * Headers: { Authorization: 'Bearer <token>' }
 * Params: { id: string (UUID) }
 * Body: { status: 'active' | 'suspended' | 'banned' | 'pending_verification' }
 *
 * DELETE /users/:id/permanent - Permanently delete user (admin only)
 * Headers: { Authorization: 'Bearer <token>' }
 * Params: { id: string (UUID) }
 *
 * POST /users/:id/restore - Restore soft-deleted user (admin only)
 * Headers: { Authorization: 'Bearer <token>' }
 * Params: { id: string (UUID) }
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UpdatePasswordDto,
  UpdateDepositLimitsDto,
  DepositDto,
  WithdrawDto,
  AddBonusDto,
  WagerDto,
  GameResultDto,
  SelfExclusionDto,
  PaginationDto,
  UserResponseDto,
} from './user.dto';
import { Users, UserRole, AccountStatus } from './user.entity';
import { ResponseBuilder } from 'src/api-response';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ==================== AUTHENTICATION & REGISTRATION ====================

  /**
   * Register a new user account
   * @route POST /users/register
   * @access Public
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return ResponseBuilder.created(
      this.mapToResponseDto(user),
      'User registered successfully',
    );
  }

  // ==================== USER PROFILE ====================

  /**
   * Get all users with pagination
   * @route GET /users?page=1&limit=10
   * @access Admin
   */
  @Get()
  async findAll(@Query(ValidationPipe) paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const { users, total } = await this.userService.findAll(page, limit);

    return ResponseBuilder.paginated(
      users.map((user) => this.mapToResponseDto(user)),
      page,
      limit,
      total,
      'Users retrieved successfully',
    );
  }

  /**
   * Get user by ID
   * @route GET /users/:id
   * @access Private (own profile) or Admin
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    return ResponseBuilder.success(
      this.mapToResponseDto(user),
      'User retrieved successfully',
    );
  }

  /**
   * Get current user's profile
   * @route GET /users/profile/me
   * @access Private
   */
  @Get('profile/me')
  async getMyProfile(@Req() req: any) {
    const userId = req.user.id;
    const user = await this.userService.findById(userId);
    return ResponseBuilder.success(
      this.mapToResponseDto(user),
      'Profile retrieved successfully',
    );
  }

  /**
   * Update user profile
   * @route PUT /users/:id
   * @access Private (own profile) or Admin
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userService.update(id, updateUserDto);
    return ResponseBuilder.updated(
      this.mapToResponseDto(user),
      'Profile updated successfully',
    );
  }

  /**
   * Change user password
   * @route PATCH /users/:id/password
   * @access Private
   */
  @Patch(':id/password')
  @HttpCode(HttpStatus.OK)
  async updatePassword(
    @Param('id') id: string,
    @Body(ValidationPipe) updatePasswordDto: UpdatePasswordDto,
  ) {
    await this.userService.updatePassword(id, updatePasswordDto.newPassword);
    return ResponseBuilder.success(null, 'Password updated successfully');
  }

  /**
   * Soft delete user account
   * @route DELETE /users/:id
   * @access Private (own account) or Admin
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.userService.softDelete(id);
    return ResponseBuilder.deleted('User account deleted successfully');
  }

  // ==================== VERIFICATION ====================

  /**
   * Verify user email
   * @route POST /users/:id/verify-email
   * @access Private or Admin
   */
  @Post(':id/verify-email')
  async verifyEmail(@Param('id') id: string) {
    const user = await this.userService.verifyEmail(id);
    return ResponseBuilder.success(
      this.mapToResponseDto(user),
      'Email verified successfully',
    );
  }

  /**
   * Verify user phone number
   * @route POST /users/:id/verify-phone
   * @access Private or Admin
   */
  @Post(':id/verify-phone')
  async verifyPhone(@Param('id') id: string) {
    const user = await this.userService.verifyPhone(id);
    return ResponseBuilder.success(
      this.mapToResponseDto(user),
      'Phone number verified successfully',
    );
  }

  /**
   * Verify user KYC
   * @route POST /users/:id/verify-kyc
   * @access Admin
   */
  @Post(':id/verify-kyc')
  async verifyKyc(@Param('id') id: string) {
    const user = await this.userService.verifyKyc(id);
    return ResponseBuilder.success(
      this.mapToResponseDto(user),
      'KYC verified successfully',
    );
  }

  // ==================== WALLET & BALANCE ====================

  /**
   * Get user's balance information
   * @route GET /users/:id/balance
   * @access Private (own balance) or Admin
   */
  @Get(':id/balance')
  async getBalance(@Param('id') id: string) {
    const balance = await this.userService.getBalance(id);
    return ResponseBuilder.success(balance, 'Balance retrieved successfully');
  }

  /**
   * Deposit funds to user account
   * @route POST /users/:id/deposit
   * @access Private
   */
  @Post(':id/deposit')
  async deposit(
    @Param('id') id: string,
    @Body(ValidationPipe) depositDto: DepositDto,
  ) {
    const user = await this.userService.deposit(id, depositDto.amount);
    return ResponseBuilder.success(
      { balance: Number(user.balance) },
      'Deposit successful',
    );
  }

  /**
   * Withdraw funds from user account
   * @route POST /users/:id/withdraw
   * @access Private
   */
  @Post(':id/withdraw')
  async withdraw(
    @Param('id') id: string,
    @Body(ValidationPipe) withdrawDto: WithdrawDto,
  ) {
    const user = await this.userService.withdraw(id, withdrawDto.amount);
    return ResponseBuilder.success(
      { balance: Number(user.balance) },
      'Withdrawal successful',
    );
  }

  /**
   * Add bonus to user account
   * @route POST /users/:id/bonus
   * @access Admin
   */
  @Post(':id/bonus')
  async addBonus(
    @Param('id') id: string,
    @Body(ValidationPipe) addBonusDto: AddBonusDto,
  ) {
    const user = await this.userService.addBonus(id, addBonusDto.amount);
    return ResponseBuilder.success(
      { bonusBalance: Number(user.bonusBalance) },
      'Bonus added successfully',
    );
  }

  // ==================== GAMING ====================

  /**
   * Process game wager
   * @route POST /users/:id/wager
   * @access Private
   */
  @Post(':id/wager')
  async processWager(
    @Param('id') id: string,
    @Body(ValidationPipe) wagerDto: WagerDto,
  ) {
    const user = await this.userService.processWager(id, wagerDto.amount);
    return ResponseBuilder.success(
      {
        balance: Number(user.balance),
        bonusBalance: Number(user.bonusBalance),
      },
      'Wager processed successfully',
    );
  }

  /**
   * Process game result (win/loss)
   * @route POST /users/:id/game-result
   * @access Private
   */
  @Post(':id/game-result')
  async processGameResult(
    @Param('id') id: string,
    @Body(ValidationPipe) gameResultDto: GameResultDto,
  ) {
    let user: Users;

    if (gameResultDto.isWin && gameResultDto.winAmount > 0) {
      user = await this.userService.processWin(id, gameResultDto.winAmount);
    } else {
      const lossAmount = gameResultDto.wagerAmount - gameResultDto.winAmount;
      user = await this.userService.processLoss(id, lossAmount);
    }

    return ResponseBuilder.success(
      { balance: Number(user.balance) },
      gameResultDto.isWin
        ? 'Congratulations! You won!'
        : 'Better luck next time!',
    );
  }

  /**
   * Get user gaming statistics
   * @route GET /users/:id/stats
   * @access Private (own stats) or Admin
   */
  @Get(':id/stats')
  async getUserStats(@Param('id') id: string) {
    const stats = await this.userService.getUserStats(id);
    return ResponseBuilder.success(stats, 'Statistics retrieved successfully');
  }

  /**
   * Get top players leaderboard
   * @route GET /users/leaderboard/top?limit=10
   * @access Public
   */
  @Get('leaderboard/top')
  async getTopPlayers(@Query('limit') limit: number = 10) {
    const users = await this.userService.getTopPlayers(limit);
    return ResponseBuilder.success(
      users.map((user) => this.mapToResponseDto(user)),
      'Leaderboard retrieved successfully',
    );
  }

  // ==================== RESPONSIBLE GAMING ====================

  /**
   * Update deposit limits
   * @route PUT /users/:id/deposit-limits
   * @access Private
   */
  @Put(':id/deposit-limits')
  async updateDepositLimits(
    @Param('id') id: string,
    @Body(ValidationPipe) limitsDto: UpdateDepositLimitsDto,
  ) {
    await this.userService.updateDepositLimits(id, limitsDto);
    return ResponseBuilder.success(
      { limits: limitsDto },
      'Deposit limits updated successfully',
    );
  }

  /**
   * Self-exclude account
   * @route POST /users/:id/self-exclude
   * @access Private
   */
  @Post(':id/self-exclude')
  async selfExclude(
    @Param('id') id: string,
    @Body(ValidationPipe) selfExclusionDto: SelfExclusionDto,
  ) {
    const user = await this.userService.selfExclude(
      id,
      selfExclusionDto.durationInDays,
    );
    return ResponseBuilder.success(
      { exclusionUntil: user.selfExclusionUntil },
      'Self-exclusion activated successfully',
    );
  }

  /**
   * Remove self-exclusion
   * @route DELETE /users/:id/self-exclude
   * @access Private
   */
  @Delete(':id/self-exclude')
  async removeSelfExclusion(@Param('id') id: string) {
    await this.userService.removeSelfExclusion(id);
    return ResponseBuilder.success(null, 'Self-exclusion removed successfully');
  }

  // ==================== SECURITY ====================

  /**
   * Enable two-factor authentication
   * @route POST /users/:id/2fa/enable
   * @access Private
   */
  @Post(':id/2fa/enable')
  async enable2FA(@Param('id') id: string, @Body('secret') secret: string) {
    await this.userService.enable2FA(id, secret);
    return ResponseBuilder.success(
      null,
      'Two-factor authentication enabled successfully',
    );
  }

  /**
   * Disable two-factor authentication
   * @route DELETE /users/:id/2fa/disable
   * @access Private
   */
  @Delete(':id/2fa/disable')
  async disable2FA(@Param('id') id: string) {
    await this.userService.disable2FA(id);
    return ResponseBuilder.success(
      null,
      'Two-factor authentication disabled successfully',
    );
  }

  /**
   * Unlock locked account
   * @route POST /users/:id/unlock
   * @access Admin
   */
  @Post(':id/unlock')
  async unlockAccount(@Param('id') id: string) {
    await this.userService.unlockAccount(id);
    return ResponseBuilder.success(null, 'Account unlocked successfully');
  }

  // ==================== ADMIN OPERATIONS ====================

  /**
   * Update user role
   * @route PATCH /users/:id/role
   * @access Admin
   */
  @Patch(':id/role')
  async updateRole(@Param('id') id: string, @Body('role') role: UserRole) {
    const user = await this.userService.updateRole(id, role);
    return ResponseBuilder.updated(
      this.mapToResponseDto(user),
      'User role updated successfully',
    );
  }

  /**
   * Update user status
   * @route PATCH /users/:id/status
   * @access Admin
   */
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: AccountStatus,
  ) {
    const user = await this.userService.updateStatus(id, status);
    return ResponseBuilder.updated(
      this.mapToResponseDto(user),
      'User status updated successfully',
    );
  }

  /**
   * Permanently delete user
   * @route DELETE /users/:id/permanent
   * @access Admin
   */
  @Delete(':id/permanent')
  @HttpCode(HttpStatus.OK)
  async permanentDelete(@Param('id') id: string) {
    await this.userService.permanentDelete(id);
    return ResponseBuilder.deleted('User permanently deleted');
  }

  /**
   * Restore soft-deleted user
   * @route POST /users/:id/restore
   * @access Admin
   */
  @Post(':id/restore')
  async restore(@Param('id') id: string) {
    const user = await this.userService.restore(id);
    return ResponseBuilder.success(
      this.mapToResponseDto(user),
      'User account restored successfully',
    );
  }

  // ==================== HELPER METHODS ====================

  /**
   * Map User entity to UserResponseDto (excludes sensitive fields)
   */
  private mapToResponseDto(user: Users): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      role: user.role,
      status: user.status,
      balance: Number(user.balance),
      bonusBalance: Number(user.bonusBalance),
      currency: user.currency,
      level: user.level,
      vipPoints: user.vipPoints,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
      isKycVerified: user.isKycVerified,
      createdAt: user.createdAt,
    };
  }
}
