import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/infrastructure/entities/user.entity';
import { FcmToken } from 'src/users/infrastructure/entities/fcm.entity';

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(FcmToken)
    private readonly fcmTokenRepository: Repository<FcmToken>,
  ) {}

  @Post('/send-to-user')
  async sendToUser(
    @Body() { email, title, body, data }: { email: string; title: string; body: string; data?: Record<string, string> }
  ) {
    if (!email || !title || !body) {
      throw new BadRequestException('Email, título y cuerpo son obligatorios.');
    }

    // Obtener los tokens FCM del usuario
    const user = await this.userRepository.findOne({ where: { email }, relations: ['fcmTokens'] });
    if (!user) {
      throw new BadRequestException('Usuario no encontrado.');
    }

    const tokens = user.fcmTokens.map(token => token.token);
    if (tokens.length === 0) {
      throw new BadRequestException('El usuario no tiene dispositivos registrados.');
    }

    return this.notificationService.sendNotificationToMultipleDevices(tokens, title, body, data);
  }

  /**
   * Enviar notificación a múltiples usuarios usando una lista de emails.
   */
  @Post('/send-to-multiple-users')
  async sendToMultipleUsers(
    @Body() { emails, title, body, data }: { emails: string[]; title: string; body: string; data?: Record<string, string> }
  ) {
    if (!emails || emails.length === 0 || !title || !body) {
      throw new BadRequestException('Emails, título y cuerpo son obligatorios.');
    }

    // Obtener tokens de los usuarios
    const users = await this.userRepository.find({
      where: emails.map(email => ({ email })),
      relations: ['fcmTokens'],
    });

    const tokens = users.flatMap(user => user.fcmTokens.map(token => token.token));

    if (tokens.length === 0) {
      throw new BadRequestException('Ninguno de los usuarios tiene dispositivos registrados.');
    }

    return this.notificationService.sendNotificationToMultipleDevices(tokens, title, body, data);
  }
}
