import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsInt, IsNotEmpty } from 'class-validator';

export class RegisterResidentDto {
  @ApiProperty({ description: 'Código de la vecindad' })
  @IsString()
  @IsNotEmpty()
  codigoVecindario: string;

  @ApiProperty({ description: 'Calle del residente' })
  @IsString()
  @IsNotEmpty()
  calle: string;

  @ApiProperty({ description: 'Número de casa del residente' })
  @IsString()
  @IsNotEmpty()
  numeroCasa: string;
}
