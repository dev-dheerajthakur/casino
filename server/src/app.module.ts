import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { CrashModule } from './crash/crash.module';

@Module({
  imports: [
    UserModule,
    CrashModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres', // <- change
        password: 'postgree2025', // <- change
        database: 'casino', // <- change
        entities: [User], // or [__dirname + '/**/*.entity{.ts,.js}']
        synchronize: true, // auto-sync schema (use false in production)
      }),
    }),
    TypeOrmModule.forFeature([User]),
    CrashModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
