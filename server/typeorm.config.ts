import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Users } from 'src/users/user.entity';

export const typeOrmConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  // logging: process.env.DB_LOGGING === 'true',
  ssl: process.env.DB_SSL === 'true',
  autoLoadEntities: true,
  // entities: [Users]
});
