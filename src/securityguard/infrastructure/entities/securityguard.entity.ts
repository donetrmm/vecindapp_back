import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../../users/infrastructure/entities/user.entity';
import { Neighborhood } from '../../../neighborhoods/infrastructure/entities/neighborhood.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('security_guards')
export class SecurityGuard {
  @ApiProperty({ description: 'ID único del guardia de seguridad' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Email del usuario asociado al guardia' })
  @ManyToOne(() => User, (user) => user.securityGuards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userEmail' })
  user: User;

  @ApiProperty({ description: 'Vecindario asignado al guardia' })
  @ManyToOne(() => Neighborhood, (neighborhood) => neighborhood.securityGuards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'neighborhoodId' })
  neighborhood: Neighborhood;
}
