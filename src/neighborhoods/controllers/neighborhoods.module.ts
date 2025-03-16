import { Module } from '@nestjs/common';
import { NeighborhoodsController } from './neighborhoods.controller';
import { NeighborhoodsService } from '../services/neighborhoods.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Neighborhood } from '../infrastructure/entities/neighborhood.entity';
import { User } from '../../users/infrastructure/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { Resident } from 'src/residents/infrastructure/entities/resident.entity';
import { EntryLog } from 'src/securityguard/infrastructure/entities/entry-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Neighborhood, User, Resident, EntryLog]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [NeighborhoodsController],
  providers: [NeighborhoodsService],
})
export class NeighborhoodsModule {}
