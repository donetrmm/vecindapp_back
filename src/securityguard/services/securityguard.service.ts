import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { SecurityGuard } from '../infrastructure/entities/securityguard.entity';
import { User } from '../../users/infrastructure/entities/user.entity';
import { Neighborhood } from '../../neighborhoods/infrastructure/entities/neighborhood.entity';
import { Resident } from '../../residents/infrastructure/entities/resident.entity';
import { NotificationService } from 'src/shared/firebase/services/notification.service';
import { RegisterGuardDto } from '../controllers/dto/registerGuard.dto';
import { EntryLog } from '../infrastructure/entities/entry-log.entity';
import { CreateEntryLogDto } from '../controllers/dto/create-entry-log.dto';
import { log } from 'console';

@Injectable()
export class SecurityGuardService {
  constructor(
    @InjectRepository(SecurityGuard) private guardRepository: Repository<SecurityGuard>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Neighborhood) private neighborhoodRepository: Repository<Neighborhood>,
    @InjectRepository(Resident) private residentRepository: Repository<Resident>,
    @InjectRepository(EntryLog) private readonly entryLogRepository: Repository<EntryLog>,
    private notificationService: NotificationService
  ) {}

  async registerGuard(registerDto: RegisterGuardDto, ownerEmail: string) {
    const user = await this.userRepository.findOne({ where: { email: ownerEmail } });
    if (!user) throw new NotFoundException('Usuario no encontrado.');
  
    const neighborhood = await this.neighborhoodRepository.findOne({ where: { codigo: registerDto.neighborhoodCode } });
    if (!neighborhood) throw new NotFoundException('Vecindario no encontrado.');
  
    const existingGuard = await this.guardRepository.findOne({ 
      where: { user: { email: user.email }, neighborhood: { id: neighborhood.id } }
    });
  
    if (existingGuard) throw new ConflictException('Este usuario ya es guardia en este vecindario.');
  
    const guard = this.guardRepository.create({ user, neighborhood });
    await this.guardRepository.save(guard);
  
    await this.neighborhoodRepository.increment({ id: neighborhood.id }, 'numeroVigilantesRegistados', 1);
  
    return { message: 'Guardia registrado exitosamente' };
  }
  

  async removeGuard(id: number) {
    const guard = await this.guardRepository.findOne({ where: { id }, relations: ['neighborhood'] });
    if (!guard) throw new NotFoundException('Guardia no encontrado.');

    await this.guardRepository.delete(id);

    guard.neighborhood.numeroVigilantesRegistados -= 1;
    await this.neighborhoodRepository.save(guard.neighborhood);

    return { message: 'Guardia eliminado correctamente' };
  }

  async verifyInviteCode(inviteCode: string) {
    return await this.residentRepository.findOne({ 
      where: { codigoInvitado: inviteCode }, 
      relations: ['user', 'user.fcmTokens']
    }) ?? null;
  }
  

  async notifyNeighborhood(neighborhoodCode: string, title: string, message: string) {
    const neighborhood = await this.neighborhoodRepository.findOne({
      where: { codigo: neighborhoodCode.toString() },
      relations: ['residents', 'residents.user', 'residents.user.fcmTokens'],
    });
  
    if (!neighborhood) throw new NotFoundException('Vecindario no encontrado.');
  
    const fcmTokens = neighborhood.residents
      .flatMap(resident => resident.user.fcmTokens) 
      .map(tokenEntity => tokenEntity.token)       
      .filter(token => token);                     
  
    if (!fcmTokens.length) {
      throw new NotFoundException('No hay dispositivos registrados para recibir la notificación.');
    }
  
    await this.notificationService.sendNotificationToMultipleDevices(fcmTokens, title, message);
  
    return { message: 'Notificación enviada a todos los miembros del vecindario.' };
  }
  
  async createLog(createEntryLogDto: CreateEntryLogDto): Promise<any> {
    console.log(createEntryLogDto);

    const residence = await this.residentRepository.findOne({
      where: { id: parseInt(createEntryLogDto.idResidencia) },
      relations: ['neighborhood'],
    });
    
    if (!residence) {
      throw new NotFoundException('Residencia no encontrada.');
    }

    const neighborhood = await this.neighborhoodRepository.findOne({
      where: { id: residence.neighborhood.id },
    });

    if (!neighborhood) {
      throw new NotFoundException('Vecindario no encontrado.');
    }

    const newEntry = this.entryLogRepository.create({
      ...createEntryLogDto,
      vecindario: neighborhood,
      residencia: createEntryLogDto.idResidencia,
    });

    const logSaved = await this.entryLogRepository.save(newEntry);
    return {
      nombre: logSaved.nombre,
      fechaEntrada: logSaved.fechaEntrada,
      placaCarro: logSaved.placaCarro,
      vigilante: logSaved.vigilante,
      residencia: logSaved.residencia,
      vecindario: logSaved.vecindario.id,
      id: logSaved.id,
    }
  }

  async getLogByResidence(idResidencia: string): Promise<EntryLog[]> {
    return this.entryLogRepository.find({
      where: { residencia: idResidencia },
    });
  }

  async getAllLogs(idVecindario: number): Promise<EntryLog[]> {
    return this.entryLogRepository.find({
      where: { vecindario: { id: idVecindario } },
    });
  }

  async verifySecurityGuard(userEmail: string, neighborhoodId: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email: userEmail } });
    if (!user) return false;

    const neighborhood = await this.neighborhoodRepository.findOne({ where: { id: parseInt(neighborhoodId) } });
    if (!neighborhood) return false;

    const guard = await this.guardRepository.findOne({ where: { user, neighborhood } });
    return !!guard;
  }
}
