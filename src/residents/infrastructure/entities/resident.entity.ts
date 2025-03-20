import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../../users/infrastructure/entities/user.entity';
import { Neighborhood } from '../../../neighborhoods/infrastructure/entities/neighborhood.entity';
import { ApiProperty } from '@nestjs/swagger';
import { EntryLog } from '../../../neighborhoods/infrastructure/entities/entry-log.entity';

@Entity('residents')
export class Resident {
  @ApiProperty({ description: 'ID único del residente' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Usuario asociado al residente' })
  @ManyToOne(() => User, (user) => user.residents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userEmail' })
  user: User;

  @ApiProperty({ description: 'Calle del residente' })
  @Column()
  calle: string;

  @ApiProperty({ description: 'Número de casa del residente' })
  @Column()
  numeroCasa: string;

  @ApiProperty({ description: 'Vecindario al que pertenece' })
  @ManyToOne(() => Neighborhood, (neighborhood) => neighborhood.residents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'neighborhoodId' })
  neighborhood: Neighborhood;

  @ApiProperty({ description: 'Modo visita (true si es visitante, false si es residente)' })
  @Column({ type: 'boolean', default: false })
  modoVisita: boolean;

  @ApiProperty({ description: 'Código de invitado único de 6 dígitos' })
  @Column({ nullable: true, length: 6 })
  codigoInvitado: string;

  @ApiProperty({ description: 'Usos del código' })
  @Column({ type: 'integer', default: 0 })
  usosCodigo: number;
}
