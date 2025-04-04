import { Controller, Post, Body, UseGuards, Request, Get, Patch, UsePipes, ValidationPipe, Delete, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResidentsService } from '../services/residents.service';
import { AuthGuard } from '@nestjs/passport';
import { RegisterResidentDto } from './dto/register-resident.dto';
import { GenerateVisitCodeDto } from './dto/generate-visit-code.dto';
import { ToggleVisitModeDto } from './dto/toggle-visit-mode.dto';
import { UpdateResidentDto } from './dto/update-resident.dto';
import { GenerateMultipleCodesDto } from './dto/generate-multiple-codes.dto';
import { QrService } from 'src/shared/firebase/services/qr.service';

@ApiTags('Residentes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('residents')
export class ResidentsController {
  constructor(
    private readonly residentsService: ResidentsService,
    private readonly qrService: QrService,
  ) {}

  @Post('/register')
  @ApiOperation({ summary: 'Registrar un residente en un vecindario' })
  @ApiResponse({
    status: 201,
    description: 'Residente registrado exitosamente.',
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async register(@Request() req, @Body() registerDto: RegisterResidentDto) {
    const ownerEmail = req.user.email;
    const residence = await this.residentsService.registerResident(
      registerDto,
      ownerEmail,
    );
    residence.codigoInvitado = '';
    return residence;
  }

  @Post('/generate-visit-code')
  @ApiOperation({ summary: 'Generar código de visita' })
  @ApiResponse({
    status: 201,
    description: 'Código de visita generado exitosamente.',
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async generateVisitCode(@Request() req, @Body() dto: GenerateVisitCodeDto) {
    const ownerEmail = req.user.email;
    const visitCode = await this.residentsService.generateVisitCode(
      dto.residenciaId,
      ownerEmail,
    );
    const qrCode = await this.qrService.generateQrCode(visitCode);
    return { succes: true, codigoInvitado: qrCode };
  }

  @Post('/generate-multiple-codes')
  @ApiOperation({ summary: 'Generar multiples códigos de visita' })
  @ApiResponse({
    status: 201,
    description: 'Códigos de visita generados exitosamente.',
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async generateMultipleVisiteCodes(
    @Request() req,
    @Body() dto: GenerateMultipleCodesDto,
  ) {
    const ownerEmail = req.user.email;
    const visitCode = await this.residentsService.generateMultipleVisitCode(
      dto.residenciaId,
      ownerEmail,
      dto.usos,
    );
    const qrCode = await this.qrService.generateQrCode(visitCode);

    return { codigoInvitado: qrCode };
  }

  @Patch('/toggle-visit-mode')
  @ApiOperation({ summary: 'Activar o desactivar modo visita' })
  @ApiResponse({
    status: 200,
    description: 'Modo visita actualizado exitosamente.',
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async toggleVisitMode(@Request() req, @Body() dto: ToggleVisitModeDto) {
    const ownerEmail = req.user.email;
    return this.residentsService.toggleVisitMode(
      dto.residenciaId,
      dto.modoVisita,
      ownerEmail,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Obtener residencias del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Lista de residencias del usuario.',
  })
  async getUserResidences(@Request() req) {
    const ownerEmail = req.user.email;
    const residences = await this.residentsService.getUserResidences(ownerEmail);
    
    const residencesWithQR = await Promise.all(residences.map(async (residence) => {
      const visitCode = residence.codigoInvitado;
      if (!visitCode) {
        return residence;
      }
      const qrCode = await this.qrService.generateQrCode(visitCode);
      return {
        ...residence,
        qrBase64: qrCode
      };
    }));
    
    return residencesWithQR;
  }

  @Get('/:residenceId')
  @ApiOperation({ summary: 'Obtener residencias del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Lista de residencias del usuario.',
  })
  async getUserResidenceById(
    @Request() req,
    @Param('residenceId') residenciaId: number,
  ) {
    const ownerEmail = req.user.email;
    return this.residentsService.getUserResidencesById(
      ownerEmail,
      residenciaId,
    );
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Actualizar datos de una residencia' })
  @ApiResponse({
    status: 200,
    description: 'Residencia actualizada exitosamente.',
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateResident(@Request() req, @Body() updateDto: UpdateResidentDto) {
    const ownerEmail = req.user.email;
    return this.residentsService.updateResident(updateDto, ownerEmail);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Eliminar una residencia' })
  @ApiResponse({
    status: 200,
    description: 'Residencia eliminada exitosamente.',
  })
  async deleteResidence(@Request() req, @Param('id') residenciaId: number) {
    const ownerEmail = req.user.email;
    return this.residentsService.deleteRegsitration(residenciaId, ownerEmail);
  }
}
