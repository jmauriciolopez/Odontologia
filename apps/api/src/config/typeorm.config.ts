import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { env } from './env.ts';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: env.DB.HOST,
  port: env.DB.PORT,
  username: env.DB.USER,
  password: env.DB.PASS,
  database: env.DB.NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: env.NODE_ENV === 'development',
  logging: env.NODE_ENV === 'development',
  autoLoadEntities: true,
};
