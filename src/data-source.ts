import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './users/infrastructure/entities/user.entity';
import { Neighborhood } from './neighborhoods/infrastructure/entities/neighborhood.entity';
import { Resident } from './residents/infrastructure/entities/resident.entity';
import * as dotenv from 'dotenv';
import { FcmToken } from './users/infrastructure/entities/fcm.entity';
import { SecurityGuard } from './securityguard/infrastructure/entities/securityguard.entity';
import { EntryLog } from './securityguard/infrastructure/entities/entry-log.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User, Neighborhood, Resident, FcmToken, SecurityGuard, EntryLog],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});