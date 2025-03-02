import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../../users/infrastructure/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('fcm_tokens')
export class FcmToken {
  @ApiProperty({ description: 'ID único del token' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Token de Firebase Cloud Messaging' })
  @Column({ type: 'varchar', unique: true })
  token: string;

  @ApiProperty({ description: 'Usuario asociado al token' })
  @ManyToOne(() => User, (user) => user.fcmTokens, { onDelete: 'CASCADE' })
  user: User;
}
