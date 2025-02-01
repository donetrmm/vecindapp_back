import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NeighborhoodsService } from '../services/neighborhoods/neighborhoods.service';
import { AuthGuard } from '@nestjs/passport';

class CreateNeighborhoodDto {
  nombre: string;
  direccion: string;
  colonia: string;
  estado: string;
  numeroCasas: number;
}

@ApiTags('Vecindades')
@ApiBearerAuth()
@Controller('neighborhoods')
export class NeighborhoodsController {
  constructor(private readonly neighborhoodsService: NeighborhoodsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Crear una nueva vecindad' })
  @ApiResponse({ status: 201, description: 'Vecindad creada exitosamente.' })
  async create(@Request() req, @Body() createDto: CreateNeighborhoodDto) {
    const ownerEmail = req.user.email;
    return this.neighborhoodsService.createNeighborhood(createDto, ownerEmail);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({ summary: 'Obtener vecindades del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de vecindades del usuario.' })
  async getUserNeighborhoods(@Request() req) {
    const ownerEmail = req.user.email;
    return this.neighborhoodsService.getNeighborhoodsByOwner(ownerEmail);
  }
}
