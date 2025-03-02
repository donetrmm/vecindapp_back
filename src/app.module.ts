import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './users/controllers/auth.module';
import { NeighborhoodsModule } from './neighborhoods/controllers/neighborhoods.module';
import { User } from './users/infrastructure/entities/user.entity';
import { Neighborhood } from './neighborhoods/infrastructure/entities/neighborhood.entity';
import { Resident } from './residents/infrastructure/entities/resident.entity';
import { ResidentsModule } from './residents/controllers/residents.module';
import { FcmToken } from './users/infrastructure/entities/fcm.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [User, Neighborhood, Resident, FcmToken],
      synchronize: false,
    }),
    AuthModule,
    NeighborhoodsModule,
    ResidentsModule
  ],
})
export class AppModule {}
