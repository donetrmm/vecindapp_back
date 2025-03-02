import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resident } from '../infrastructure/entities/resident.entity';
import { Neighborhood } from '../../neighborhoods/infrastructure/entities/neighborhood.entity';
import { RegisterResidentDto } from '../dto/register-resident.dto';
import { UpdateResidentDto } from '../dto/update-resident.dto';

@Injectable()
export class ResidentsService {
  constructor(
    @InjectRepository(Resident)
    private residentsRepository: Repository<Resident>,
    @InjectRepository(Neighborhood)
    private neighborhoodsRepository: Repository<Neighborhood>,
  ) {}

  async registerResident(dto: RegisterResidentDto, ownerEmail: string): Promise<Resident> {
    const neighborhood = await this.neighborhoodsRepository.findOne({ where: { codigo: dto.codigoVecindario } });

    if (!neighborhood) throw new NotFoundException('Vecindario no encontrado');

    if (neighborhood.numeroCasasRegistradas >= neighborhood.numeroCasas) {
      throw new NotFoundException('Vecindario lleno');
    }
    neighborhood.numeroCasasRegistradas++;
    await this.neighborhoodsRepository.save(neighborhood);

    const resident = this.residentsRepository.create({
      calle: dto.calle,
      numeroCasa: dto.numeroCasa,
      neighborhood,
      user: { email: ownerEmail },
    });

    return this.residentsRepository.save(resident);
  }

  async generateVisitCode(residenciaId: number, ownerEmail: string): Promise<string> {
    const resident = await this.residentsRepository.findOne({ 
        where: { id: residenciaId }, 
        relations: ['user']
      });    
    if (!resident) throw new NotFoundException('Residencia no encontrada');
    if (resident.user.email !== ownerEmail) throw new ForbiddenException('No autorizado');
    let uniqueCode: string;
    let isUnique = false;
  
    do {
      uniqueCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const existingResident = await this.residentsRepository.findOne({ where: { codigoInvitado: uniqueCode } });
      if (!existingResident) isUnique = true;
    } while (!isUnique);
  
    resident.codigoInvitado = uniqueCode;
    await this.residentsRepository.save(resident);
    
    return resident.codigoInvitado;
  }
  

  async toggleVisitMode(residenciaId: number, modoVisita: boolean, ownerEmail: string) {
    const resident = await this.residentsRepository.findOne({ 
        where: { id: residenciaId }, 
        relations: ['user']
      });
    if (!resident) throw new NotFoundException('Residencia no encontrada');
    if (resident.user.email !== ownerEmail) throw new ForbiddenException('No autorizado');

    resident.modoVisita = modoVisita;
    return this.residentsRepository.save(resident);
  }

  async getUserResidences(ownerEmail: string) {
    return this.residentsRepository.find({ 
        where: { 
            user: { email: ownerEmail }
        }
    });
  }

  async updateResident(updateDto: UpdateResidentDto, ownerEmail: string) {
    const resident = await this.residentsRepository.findOne({ 
        where: { id: updateDto.id }, 
        relations: ['user']
      });
    if (!resident) throw new NotFoundException('Residencia no encontrada');
    if (resident.user.email !== ownerEmail) throw new ForbiddenException('No autorizado');
  
    const updatedResident = this.residentsRepository.merge(resident, updateDto);
    
    return this.residentsRepository.save(updatedResident);
  }
}
