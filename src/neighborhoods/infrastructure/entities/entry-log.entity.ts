import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Resident } from '../../../residents/infrastructure/entities/resident.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Neighborhood } from './neighborhood.entity';

@Entity('entry_logs')
export class EntryLog {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID del registro de entrada' })
  id: number;

  @Column()
  @ApiProperty({ description: 'Nombre del visitante que ingresa' })
  nombre: string;

  @CreateDateColumn()
  @ApiProperty({ description: 'Fecha y hora de ingreso)', example: '2025-03-05T12:34:56.789Z' })
  fechaEntrada: Date;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Placa del vehículo (opcional)', required: false })
  placaCarro?: string;

  @Column()
  @ApiProperty({ description: 'Vigilante que registra la entrada' })
  vigilante: string;

  @ApiProperty({ description: 'Residencia asociada a la entrada' })
  @Column()
  residencia: string;
  
  @ManyToOne(() => Neighborhood, (neighborhood) => neighborhood.entryLogs, { nullable: false, onDelete: 'CASCADE' })
  @ApiProperty({ description: 'Vecindario asociado a la entrada', type: () => Neighborhood })
  vecindario: Neighborhood;
  
}
