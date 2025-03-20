import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class GenerateMultipleCodesDto {
  @ApiProperty({ description: 'ID de la residencia' })
  @IsInt()
  @IsNotEmpty()
  residenciaId: number;

  @ApiProperty({ description: 'Número de códigos a generar' })
  @IsInt()
  @IsNotEmpty()
  usos: number;
}
