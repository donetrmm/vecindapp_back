import { Controller, Post, Body, UseGuards, Request, Get, Patch, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResidentsService } from '../services/residents.service';
import { AuthGuard } from '@nestjs/passport';
import { RegisterResidentDto } from './dto/register-resident.dto';
import { GenerateVisitCodeDto } from './dto/generate-visit-code.dto';
import { ToggleVisitModeDto } from './dto/toggle-visit-mode.dto';
import { UpdateResidentDto } from './dto/update-resident.dto';

@ApiTags('Residentes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('residents')
export class ResidentsController {
  constructor(private readonly residentsService: ResidentsService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Registrar un residente en un vecindario' })
  @ApiResponse({ status: 201, description: 'Residente registrado exitosamente.' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  
  async register(@Request() req, @Body() registerDto: RegisterResidentDto) {
    const ownerEmail = req.user.email;
    return this.residentsService.registerResident(registerDto, ownerEmail);
  }

  @Post('/generate-visit-code')
  @ApiOperation({ summary: 'Generar código de visita' })
  @ApiResponse({ status: 201, description: 'Código de visita generado exitosamente.' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async generateVisitCode(@Request() req, @Body() dto: GenerateVisitCodeDto) {
    const ownerEmail = req.user.email;
    const visitCode = await this.residentsService.generateVisitCode(dto.residenciaId, ownerEmail);
    return { codigoInvitado: visitCode };
  }

  @Patch('/toggle-visit-mode')
  @ApiOperation({ summary: 'Activar o desactivar modo visita' })
  @ApiResponse({ status: 200, description: 'Modo visita actualizado exitosamente.' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async toggleVisitMode(@Request() req, @Body() dto: ToggleVisitModeDto) {
    const ownerEmail = req.user.email;
    return this.residentsService.toggleVisitMode(dto.residenciaId, dto.modoVisita, ownerEmail);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener residencias del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de residencias del usuario.' })
  async getUserResidences(@Request() req) {
    const ownerEmail = req.user.email;
    return this.residentsService.getUserResidences(ownerEmail);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Actualizar datos de una residencia' })
  @ApiResponse({ status: 200, description: 'Residencia actualizada exitosamente.' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateResident(@Request() req, @Body() updateDto: UpdateResidentDto) {
    const ownerEmail = req.user.email;
    return this.residentsService.updateResident(updateDto, ownerEmail);
  }
}
