import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsBoolean, IsNotEmpty } from 'class-validator';

export class ToggleVisitModeDto {
  @ApiProperty({ description: 'ID de la residencia' })
  @IsInt()
  @IsNotEmpty()
  residenciaId: number;

  @ApiProperty({ description: 'Modo visita (true = visitante, false = residente)' })
  @IsBoolean()
  @IsNotEmpty()
  modoVisita: boolean;
}
