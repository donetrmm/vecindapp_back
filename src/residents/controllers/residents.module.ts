import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Neighborhood } from 'src/neighborhoods/infrastructure/entities/neighborhood.entity';
import { User } from '../../users/infrastructure/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { ResidentsController } from './residents.controller';
import { ResidentsService } from '../services/residents.service';
import { Resident } from '../infrastructure/entities/resident.entity';
import { EntryLog } from 'src/neighborhoods/infrastructure/entities/entry-log.entity';
import { QrService } from 'src/shared/firebase/services/qr.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Neighborhood, User, Resident, EntryLog]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [ResidentsController],
  providers: [ResidentsService, QrService],
})
export class ResidentsModule {}
