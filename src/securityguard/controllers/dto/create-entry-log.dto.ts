import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEntryLogDto {
  @ApiProperty({ description: 'Nombre del visitante que ingresa' })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({ description: 'Placa del vehículo (opcional)', required: false })
  @IsOptional()
  @IsString()
  placaCarro?: string;

  @ApiProperty({ description: 'ID de la residencia asociada' })
  @IsNotEmpty()
  @IsNumber()
  idResidencia: string;

  
}
