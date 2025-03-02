import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Neighborhood } from '../../../neighborhoods/infrastructure/entities/neighborhood.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Resident } from '../../..//residents/infrastructure/entities/resident.entity';
import { FcmToken } from './fcm.entity';
import { SecurityGuard } from '../../../securityguard/infrastructure/entities/securityguard.entity';

@Entity('users')
export class User {
  @ApiProperty({ description: 'Email del usuario' })
  @PrimaryColumn()
  email: string;

  @ApiProperty({ description: 'Password del usuario' })
  @Column()
  password: string;
  
  @ApiProperty({ description: 'Tokens de Firebase Cloud Messaging' })
  @OneToMany(() => FcmToken, (fcmToken) => fcmToken.user, { cascade: true }) 
  fcmTokens: FcmToken[];

  @OneToMany(() => Neighborhood, neighborhood => neighborhood.owner)
  neighborhoods: Neighborhood[];

  @ApiProperty({ description: 'Residentes asociados al usuario' })
  @OneToMany(() => Resident, (resident) => resident.user)
  residents: Resident[];

  @OneToMany(() => SecurityGuard, (securityGuard) => securityGuard.user)
  securityGuards: SecurityGuard[];
}
