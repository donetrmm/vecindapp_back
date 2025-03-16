import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecurityGuardService } from '../services/securityguard.service';
import { SecurityGuardController } from './securityguard.controller';
import { SecurityGuard } from '../infrastructure/entities/securityguard.entity';
import { Neighborhood } from '../../neighborhoods/infrastructure/entities/neighborhood.entity';
import { Resident } from '../../residents/infrastructure/entities/resident.entity';
import { User } from '../../users/infrastructure/entities/user.entity';
import { NotificationService } from 'src/shared/firebase/services/notification.service';
import { ResidentsService } from '../../residents/services/residents.service';
import { EntryLog } from '../infrastructure/entities/entry-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SecurityGuard, Neighborhood, Resident, User, EntryLog]),
  ],
  controllers: [SecurityGuardController],
  providers: [SecurityGuardService, NotificationService, ResidentsService],
  exports: [SecurityGuardService],
})
export class SecurityGuardModule {}
