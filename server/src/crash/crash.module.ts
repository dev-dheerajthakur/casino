import { Module } from '@nestjs/common';
import { CrashService } from './crash.service';
import { CrashGateway } from './crash.gateway';

@Module({
  providers: [CrashService, CrashGateway]
})
export class CrashModule {}
