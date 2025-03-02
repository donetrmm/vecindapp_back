import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterGuardDto {
  @ApiProperty({
    example: 'ABC123',
    description: 'Código único del vecindario donde se registrará el guardia',
  })
  @IsString()
  @IsNotEmpty()
  neighborhoodCode: string;
}

