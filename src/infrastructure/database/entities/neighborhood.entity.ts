import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('neighborhoods')
export class Neighborhood {
  @ApiProperty({ description: 'ID de la vecindad' })
  @PrimaryGeneratedColumn()
  id: number;

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

  @ApiProperty({ description: 'Número de casas' })
  @Column('int')
  numeroCasas: number;

  @ManyToOne(() => User, user => user.neighborhoods)
  @JoinColumn({ name: 'ownerEmail' })
  owner: User;
}
