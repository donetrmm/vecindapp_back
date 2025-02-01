// src/services/neighborhoods/neighborhoods.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Neighborhood } from '../../infrastructure/database/entities/neighborhood.entity';
import { Repository } from 'typeorm';
import { User } from '../../infrastructure/database/entities/user.entity';

@Injectable()
export class NeighborhoodsService {
  constructor(
    @InjectRepository(Neighborhood)
    private neighborhoodsRepository: Repository<Neighborhood>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createNeighborhood(data: {
    nombre: string,
    direccion: string,
    colonia: string,
    estado: string,
    numeroCasas: number,
  }, ownerEmail: string): Promise<Neighborhood> {
    const owner = await this.usersRepository.findOne({ where: { email: ownerEmail } });
    if (!owner) {
      throw new Error('Propietario no encontrado');
    }
    const neighborhood = this.neighborhoodsRepository.create({
      ...data,
      owner,
    });
    return this.neighborhoodsRepository.save(neighborhood);
  }

  async getNeighborhoodsByOwner(ownerEmail: string): Promise<Neighborhood[]> {
    return this.neighborhoodsRepository.find({
      where: { owner: { email: ownerEmail } },
    });
  }
}
