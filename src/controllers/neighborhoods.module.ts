import { Module } from '@nestjs/common';
import { NeighborhoodsController } from './neighborhoods.controller';
import { NeighborhoodsService } from '../services/neighborhoods/neighborhoods.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Neighborhood } from '../infrastructure/database/entities/neighborhood.entity';
import { User } from '../infrastructure/database/entities/user.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Neighborhood, User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [NeighborhoodsController],
  providers: [NeighborhoodsService],
})
export class NeighborhoodsModule {}
