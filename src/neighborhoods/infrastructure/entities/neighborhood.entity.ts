import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BeforeInsert, OneToMany } from 'typeorm';
import { User } from '../../../users/infrastructure/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Resident } from '../../../residents/infrastructure/entities/resident.entity';
import { SecurityGuard } from '../../../securityguard/infrastructure/entities/securityguard.entity';
import { EntryLog } from './entry-log.entity';
import { SecurityGuardLog } from '../../../securityguard/infrastructure/entities/securittGuardLog.entity';

@Entity('neighborhoods')
export class Neighborhood {
  @ApiProperty({ description: 'ID de la vecindad' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Código único de la vecindad (5 dígitos)' })
  @Column({ unique: true, length: 5 })
  codigo: string;

  @ApiProperty({ description: 'Nombre de la vecindad' })
  @Column()
  nombre: string;

  @ApiProperty({ description: 'Dirección' })
  @Column()
  direccion: string;

  @ApiProperty({ description: 'Colonia' })
  @Column()
  colonia: string;

  @ApiProperty({ description: 'Estado' })
  @Column()
  estado: string;

  @ApiProperty({ description: 'Número total de casas en la vecindad' })
  @Column('int')
  numeroCasas: number;

  @ApiProperty({ description: 'Número de casas registradas' })
  @Column('int', { default: 0 })
  numeroCasasRegistradas: number;

  @ApiProperty({ description: 'Número total vigilantes' })
  @Column('int')
  numeroVigilantes: number;

  @ApiProperty({ description: 'Número de vigilantes registrados' })
  @Column('int')
  numeroVigilantesRegistados: number;

  @ManyToOne(() => User, user => user.neighborhoods, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerEmail' })
  owner: User;

  @ApiProperty({ description: 'Lista de residentes en la vecindad' })
  @OneToMany(() => Resident, (resident) => resident.neighborhood)
  residents: Resident[];

  @OneToMany(() => SecurityGuard, (securityGuard) => securityGuard.neighborhood)
  securityGuards: SecurityGuard[];

  @OneToMany(() => EntryLog, (entryLog) => entryLog.vecindario)
  @ApiProperty({ description: 'Registros de entradas asociados al vecindario', type: () => EntryLog, isArray: true })
    entryLogs: EntryLog[];

  @OneToMany(() => SecurityGuardLog, (securityGuardLog) => securityGuardLog.vecindario)
  guardLogs: SecurityGuard[];
/*
  @BeforeInsert()
  generateCodigo() {
    this.codigo = Math.floor(10000 + Math.random() * 90000).toString(); 
  }*/
}
