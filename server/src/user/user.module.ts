import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';

/**
 * UserModule - Manages user-related functionality for the casino platform
 * 
 * IMPORTS:
 * - TypeOrmModule.forFeature([User]) - Registers User entity with TypeORM
 * 
 * CONTROLLERS:
 * - UserController - Handles HTTP requests for user operations
 * 
 * PROVIDERS:
 * - UserService - Contains business logic for user management
 * 
 * EXPORTS:
 * - UserService - Exported for use in other modules (Auth, Transaction, Game, etc.)
 * 
 * DEPENDENCIES:
 * This module should be imported by:
 * - AuthModule (for authentication and authorization)
 * - TransactionModule (for wallet operations)
 * - GameModule (for gaming statistics)
 * - AdminModule (for user management)
 * 
 * USAGE IN APP MODULE:
 * ```typescript
 * @Module({
 *   imports: [
 *     TypeOrmModule.forRoot({...}),
 *     UserModule,
 *     AuthModule,
 *     // other modules
 *   ],
 * })
 * export class AppModule {}
 * ```
 */


@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Export service for use in other modules
})
export class UserModule {}