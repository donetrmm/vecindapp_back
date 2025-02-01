import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './controllers/auth.module';
import { NeighborhoodsModule } from './controllers/neighborhoods.module';
import { User } from './infrastructure/database/entities/user.entity';
import { Neighborhood } from './infrastructure/database/entities/neighborhood.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'vecindapp.c70dxwsppzvc.us-east-1.rds.amazonaws.com',
      port: 3306,
      username: 'admin',
      password: 'brandi12',
      database: 'vecindapp',
      entities: [User, Neighborhood],
      synchronize: false,
    }),
    AuthModule,
    NeighborhoodsModule,
  ],
})
export class AppModule {}
