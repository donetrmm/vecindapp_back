import { DataSource } from 'typeorm';
import { User } from './infrastructure/database/entities/user.entity';
import { Neighborhood } from './infrastructure/database/entities/neighborhood.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'vecindapp.c70dxwsppzvc.us-east-1.rds.amazonaws.com',
  port: 3306,
  username: 'admin',
  password: 'brandi12',
  database: 'vecindapp',
  entities: [User, Neighborhood],
  migrations: ['src/migrations/*.ts'], 
  synchronize: false, 
});
