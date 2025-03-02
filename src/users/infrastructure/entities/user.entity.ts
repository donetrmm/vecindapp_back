import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Neighborhood } from '../../../neighborhoods/infrastructure/entities/neighborhood.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Resident } from '../../..//residents/infrastructure/entities/resident.entity';

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

  @ApiProperty({ description: 'Residentes asociados al usuario' })
  @OneToMany(() => Resident, (resident) => resident.user)
  residents: Resident[];

}
