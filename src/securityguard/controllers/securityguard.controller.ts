import { 
    Controller, Post, Delete, Body, Param, NotFoundException, 
    Request,
    UseGuards,
    Get
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
  import { SecurityGuardService } from '../services/securityguard.service';
  import { RegisterGuardDto } from './dto/registerGuard.dto';
  import { NotificationService } from 'src/shared/firebase/services/notification.service';
import { AuthGuard } from '@nestjs/passport';
import { ResidentsService } from 'src/residents/services/residents.service';
import { CreateEntryLogDto } from './dto/create-entry-log.dto';
import { EntryLog } from '../infrastructure/entities/entry-log.entity';
  
  @ApiTags('Security Guards') 
  @Controller('security-guards')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  export class SecurityGuardController {
    constructor(
      private readonly securityGuardService: SecurityGuardService,
      private readonly notificationService: NotificationService,
      private readonly residentsService: ResidentsService,
    ) {}
  
  
    @Post('register')
    @ApiOperation({ summary: 'Registrar un guardia de seguridad' })
    @ApiBody({ type: RegisterGuardDto, description: 'Datos del guardia de seguridad' })
    @ApiResponse({ status: 201, description: 'Guardia registrado correctamente.' })
    @ApiResponse({ status: 400, description: 'Datos inválidos.' })
    @Post('register')
    async registerGuard(@Request() req, @Body() registerDto: RegisterGuardDto) {
      const ownerEmail = req.user.email;
      return this.securityGuardService.registerGuard(registerDto, ownerEmail); 
    }
    

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un guardia de seguridad' })
    @ApiParam({ name: 'id', type: Number, description: 'ID del guardia a eliminar' })
    @ApiResponse({ status: 200, description: 'Guardia eliminado correctamente.' })
    @ApiResponse({ status: 404, description: 'Guardia no encontrado.' })
    async removeGuard(@Param('id') id: number) {
      return this.securityGuardService.removeGuard(id);
    }
  
    @Post('verify-invite/:code')
    @ApiOperation({ summary: 'Verificar código de invitado' })
    @ApiParam({ name: 'code', type: String, description: 'Código de invitado a verificar' })
    @ApiResponse({ status: 200, description: 'Código verificado y notificación enviada.' })
    @ApiResponse({ status: 404, description: 'Código no válido o usuario sin tokens FCM registrados.' })
    async verifyInviteCode(@Request() req, @Param('code') inviteCode: string) {
        if (inviteCode.length !== 6) {
          throw new NotFoundException('Código de invitado no válido.');
        }
        const resident = await this.securityGuardService.verifyInviteCode(inviteCode);
        
        if (!resident) {
          throw new NotFoundException('Código de invitado no válido.');
        }
        
        const fcmTokens = resident.user.fcmTokens.map(token => token.token);
    
        if (!fcmTokens.length) {
          await this.residentsService.resetInvitationCode(resident.id, resident.user.email);
          throw new NotFoundException('Código válido, pero el usuario no tiene tokens FCM registrados.');
        }
    
        console.log('✅ Enviando notificación a:', fcmTokens);
    
        await this.notificationService.sendNotificationToMultipleDevices(
          fcmTokens,
          '🚨 Alerta de Invitado',
          'Se ha registrado el ingreso de un invitado con tu código.'
        );
    
        await this.residentsService.resetInvitationCode(resident.id, resident.user.email);
    
        return { message: '✅ Código verificado y residente notificado.' };
      }
  
    @Post('notify-neighborhood/:neighborhoodCode')
    @ApiOperation({ summary: 'Notificar a todos los miembros de un vecindario' })
    @ApiParam({ name: 'neighborhoodCode', type: Number, description: 'ID del vecindario' })
    @ApiBody({ 
      schema: { 
        type: 'object',
        properties: {
          title: { type: 'string', example: 'Título de la notificación' },
          message: { type: 'string', example: 'Cuerpo del mensaje' }
        }
      }
    })
    @ApiResponse({ status: 200, description: 'Notificación enviada a todos los miembros.' })
    @ApiResponse({ status: 404, description: 'Vecindario no encontrado.' })
    async notifyNeighborhood(
      @Param('neighborhoodCode') neighborhoodCode: string,
      @Body() body: { title: string; message: string }
    ) {
      return this.securityGuardService.notifyNeighborhood(neighborhoodCode, body.title, body.message);
    }

    @Post('/log')
    @ApiOperation({ summary: 'Registrar una nueva entrada' })
    @ApiResponse({ status: 201, description: 'Entrada registrada exitosamente.', type: EntryLog })
    async createLog(@Request() req, @Body() createEntryLogDto: CreateEntryLogDto): Promise<EntryLog> {
      const createLog = {
        ...createEntryLogDto,
        vigilante: req.user.email,
        fechaEntrada: new Date(),
      };
  
      return this.securityGuardService.createLog(createLog);
    }
  
    @Get('/log/residence/:idResidencia')
    @ApiOperation({ summary: 'Obtener registros de entradas por residencia' })
    @ApiResponse({ status: 200, description: 'Lista de registros de entrada', type: [EntryLog] })
    async getByResidence(@Param('idResidencia') idResidencia: string): Promise<EntryLog[]> {
      return this.securityGuardService.getLogByResidence(idResidencia);
    }
  
    @Get('/log/neighborhood/:idVecindario')
    @ApiOperation({ summary: 'Obtener todos los registros del vecindario' })
    @ApiResponse({ status: 200, description: 'Lista de registros de entrada en el vecindario', type: [EntryLog] })
    async getAll(@Param('idVecindario') idVecindario: number): Promise<EntryLog[]> {
      return this.securityGuardService.getAllLogs(idVecindario);
    }
  }
  