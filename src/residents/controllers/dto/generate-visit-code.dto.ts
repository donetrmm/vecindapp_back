import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class GenerateVisitCodeDto {
  @ApiProperty({ description: 'ID de la residencia' })
  @IsInt()
  @IsNotEmpty()
  residenciaId: number;
}
