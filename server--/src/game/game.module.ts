import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';

@Module({
  controllers: [GameController, AuthController],
  // imports: [AuthModule]
})
export class GameModule {}
