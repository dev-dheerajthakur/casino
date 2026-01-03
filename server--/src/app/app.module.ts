import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RateLimiterMiddleware } from '../common/middleware/rate-limiter.middleware';
import { UserModule } from './users/user.module';
import { Users } from './users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres', // <- change
        password: 'postgree2025', // <- change
        database: 'casino', // <- change
        entities: [Users], // or [__dirname + '/**/*.entity{.ts,.js}']
        synchronize: true, // auto-sync schema (use false in production)
      }),
    }),
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(RateLimiterMiddleware).forRoutes('*');
  // }
}
