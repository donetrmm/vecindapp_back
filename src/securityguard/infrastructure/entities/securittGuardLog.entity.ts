import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Neighborhood } from '../../../neighborhoods/infrastructure/entities/neighborhood.entity';

@Entity('security_guard_logs')
export class SecurityGuardLog {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID del registro de turno' })
  id: number;

  @Column()
  @ApiProperty({ description: 'Correo del vigilante' })
  email: string;

  @CreateDateColumn()
  @ApiProperty({ description: 'Fecha y hora de entrada', example: '2025-03-05T08:00:00.000Z' })
  entrada: Date;

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty({ description: 'Fecha y hora de salida', example: '2025-03-05T18:00:00.000Z', required: false })
  salida?: Date;

  @ManyToOne(() => Neighborhood, (neighborhood) => neighborhood.guardLogs, { nullable: false, onDelete: 'CASCADE' })
  @ApiProperty({ description: 'Vecindario donde trabaja el vigilante', type: () => Neighborhood })
  vecindario: Neighborhood;
}
