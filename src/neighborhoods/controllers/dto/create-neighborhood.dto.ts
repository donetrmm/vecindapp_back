import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, IsNotEmpty } from 'class-validator';

export class CreateNeighborhoodDto {
  @ApiProperty({ description: 'Nombre de la vecindad' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ description: 'Dirección' })
  @IsString()
  @IsNotEmpty()
  direccion: string;

  @ApiProperty({ description: 'Colonia' })
  @IsString()
  @IsNotEmpty()
  colonia: string;

  @ApiProperty({ description: 'Estado' })
  @IsString()
  @IsNotEmpty()
  estado: string;

  @ApiProperty({ description: 'Número de casas' })
  @IsInt()
  @Min(1)
  numeroCasas: number;
}
