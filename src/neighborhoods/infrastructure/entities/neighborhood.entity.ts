import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BeforeInsert } from 'typeorm';
import { User } from '../../../users/infrastructure/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

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

  @ManyToOne(() => User, user => user.neighborhoods, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerEmail' })
  owner: User;

  @BeforeInsert()
  generateCodigo() {
    this.codigo = Math.floor(10000 + Math.random() * 90000).toString(); 
  }
}
