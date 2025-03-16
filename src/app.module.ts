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
import { SecurityGuard } from './securityguard/infrastructure/entities/securityguard.entity';
import { SecurityGuardModule } from './securityguard/controllers/securityguard.module';
import { EntryLog } from './neighborhoods/infrastructure/entities/entry-log.entity';
import { SecurityGuardLog } from './securityguard/infrastructure/entities/securittGuardLog.entity';

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
      entities: [User, Neighborhood, Resident, FcmToken, SecurityGuard, EntryLog, SecurityGuardLog],
      synchronize: false,
    }),
    AuthModule,
    NeighborhoodsModule,
    ResidentsModule,
    SecurityGuardModule
  ],
})
export class AppModule {}
