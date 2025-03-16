import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateGuardLogDto {
    @ApiProperty({ description: 'Neighborhood id'})
    @IsNotEmpty()
    neighborhoodId: number;
}