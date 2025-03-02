// src/services/neighborhoods/neighborhoods.service.ts
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Neighborhood } from '../infrastructure/entities/neighborhood.entity';
import { Repository } from 'typeorm';
import { User } from '../../users/infrastructure/entities/user.entity';
import { UpdateNeighborhoodDto } from '../controllers/dto/update-neighborhood.dto';

@Injectable()
export class NeighborhoodsService {
  constructor(
    @InjectRepository(Neighborhood)
    private neighborhoodsRepository: Repository<Neighborhood>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createNeighborhood(
    data: {
      nombre: string;
      direccion: string;
      colonia: string;
      estado: string;
      numeroCasas: number;
      numeroVigilantes: number;
    },
    ownerEmail: string
  ): Promise<Neighborhood> {
    const owner = await this.usersRepository.findOne({ where: { email: ownerEmail } });
    if (!owner) {
      throw new Error('Propietario no encontrado');
    }
  
    let codigo: string;
    let exists: Neighborhood | null;
  
    do {
      codigo = this.generateUniqueCode();
      exists = await this.neighborhoodsRepository.findOne({ where: { codigo } });
    } while (exists); 
  
    const neighborhood = this.neighborhoodsRepository.create({
      ...data,
      codigo,
      owner,
    });
  
    return this.neighborhoodsRepository.save(neighborhood);
  }
  
  private generateUniqueCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }
  
  async getNeighborhoodsByOwner(ownerEmail: string): Promise<Neighborhood[]> {
    return this.neighborhoodsRepository.find({
      where: { owner: { email: ownerEmail } },
    });
  }

  async getResidentNeighborhoodsByOwner(ownerEmail: string): Promise<Neighborhood[]> {
    return this.neighborhoodsRepository.find({
      where: { owner: { email: ownerEmail } },
      relations: ['residents'],
    });
  }

  async updateNeighborhood(id: number, data: UpdateNeighborhoodDto, ownerEmail: string): Promise<Neighborhood> {
    const neighborhood = await this.neighborhoodsRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!neighborhood) {
      throw new NotFoundException('Vecindad no encontrada');
    }

    if (neighborhood.owner.email !== ownerEmail) {
      throw new ForbiddenException('No tienes permisos para modificar esta vecindad');
    }

    Object.assign(neighborhood, data); 
    return this.neighborhoodsRepository.save(neighborhood);
  }

  async deleteNeighborhood(id: number, ownerEmail: string): Promise<void> {
    const neighborhood = await this.neighborhoodsRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!neighborhood) {
      throw new NotFoundException('Vecindad no encontrada');
    }

    if (neighborhood.owner.email !== ownerEmail) {
      throw new ForbiddenException('No tienes permisos para eliminar esta vecindad');
    }

    await this.neighborhoodsRepository.remove(neighborhood);
  }
}