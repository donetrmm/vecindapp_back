import { Module } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../infrastructure/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../infrastructure/auth/jwt.strategy';
import * as dotenv from 'dotenv';
import { FcmToken } from '../infrastructure/entities/fcm.entity';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([User, FcmToken]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '6h' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
