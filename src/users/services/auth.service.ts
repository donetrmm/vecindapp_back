import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../infrastructure/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { FcmToken } from '../infrastructure/entities/fcm.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(FcmToken)
    private fcmTokenRepository: Repository<FcmToken>,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string): Promise<Object> {
    const existing = await this.usersRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('El usuario ya existe');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({ email, password: hashedPassword });
    await this.usersRepository.save(user);

    return { success: true };
  }

  async login(email: string, password: string): Promise<string | null> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      const payload = { email: user.email };
      return this.jwtService.sign(payload);
    }
    return null;
  }

  async validateUser(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new ConflictException('Usuario no encontrado');
    }
    return user;
  }

  async registerFcmToken(userEmail: string, token: string) {
    const user = await this.usersRepository.findOne({ where: { email: userEmail }, relations: ['fcmTokens'] });
    if (!user) throw new NotFoundException('Usuario no encontrado');
  
    const existingToken = user.fcmTokens.find(t => t.token === token);
    if (existingToken) return { message: 'Token ya registrado' };
  
    const newToken = this.fcmTokenRepository.create({ token, user });
    await this.fcmTokenRepository.save(newToken);
  
    return { message: 'Token registrado correctamente' };
  }
  
  async removeFcmToken(userEmail: string, token: string) {
    const tk = await this.fcmTokenRepository.findOne({
      where: { token },
      relations: ['user'],
    });
  
    if (!tk) throw new NotFoundException('Token no encontrado');
    if (tk.user.email !== userEmail) throw new ForbiddenException('No autorizado');
  
    await this.fcmTokenRepository.delete({ token });
  
    return { message: 'Token eliminado' };
  }
  

}
