import { 
  Controller, Post, Body, UseGuards, Request, Get, Param, Patch, Delete, 
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NeighborhoodsService } from '../services/neighborhoods.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateNeighborhoodDto } from './dto/create-neighborhood.dto';
import { UpdateNeighborhoodDto } from './dto/update-neighborhood.dto';

@ApiTags('Vecindades')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('neighborhoods')
export class NeighborhoodsController {
  constructor(private readonly neighborhoodsService: NeighborhoodsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva vecindad' })
  @ApiResponse({ status: 201, description: 'Vecindad creada exitosamente.' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))

  async create(@Request() req, @Body() createDto: CreateNeighborhoodDto) {
    const ownerEmail = req.user.email;
    return this.neighborhoodsService.createNeighborhood(createDto, ownerEmail);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener vecindades del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de vecindades del usuario.' })
  async getUserNeighborhoods(@Request() req) {
    const ownerEmail = req.user.email;
    return this.neighborhoodsService.getNeighborhoodsByOwner(ownerEmail);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener residentes de las vecindades del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de recidentes de las vecindades del usuario.' })
  async getUserNeighborhoodsResidents(@Request() req) {
    const ownerEmail = req.user.email;
    return this.neighborhoodsService.getResidentNeighborhoodsByOwner(ownerEmail);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una vecindad' })
  @ApiResponse({ status: 200, description: 'Vecindad actualizada exitosamente.' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id') id: number,
    @Request() req,
    @Body() updateDto: UpdateNeighborhoodDto
  ) {
    const ownerEmail = req.user.email;
    return this.neighborhoodsService.updateNeighborhood(id, updateDto, ownerEmail);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una vecindad' })
  @ApiResponse({ status: 200, description: 'Vecindad eliminada exitosamente.' })
  async delete(@Param('id') id: number, @Request() req) {
    const ownerEmail = req.user.email;
    return this.neighborhoodsService.deleteNeighborhood(id, ownerEmail);
  }
}
