import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsNotEmpty } from 'class-validator';

export class UpdateResidentDto {
  
  @ApiProperty({ description: 'ID del residente', required: true })
  @IsInt()  
  @IsNotEmpty()
  id: number

  @ApiProperty({ description: 'Calle del residente', required: false })
  @IsString()
  @IsOptional()
  calle?: string;

  @ApiProperty({ description: 'Número de casa del residente', required: false })
  @IsString()
  @IsOptional()
  numeroCasa?: string;
}
