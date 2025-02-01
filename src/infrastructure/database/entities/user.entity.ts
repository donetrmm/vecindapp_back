import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Neighborhood } from './neighborhood.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({ description: 'Email del usuario' })
  @PrimaryColumn()
  email: string;

  @ApiProperty({ description: 'Password del usuario' })
  @Column()
  password: string;

  @OneToMany(() => Neighborhood, neighborhood => neighborhood.owner)
  neighborhoods: Neighborhood[];
}
