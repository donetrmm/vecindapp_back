import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { firebaseApp } from '../config/firebase.config';
import * as admin from 'firebase-admin';

@Injectable()
export class NotificationService {
  private readonly MAX_TOKENS_PER_BATCH = 500;

  /**
   * Envía una notificación a un solo dispositivo.
   * @param token Token FCM del dispositivo destino.
   * @param title Título de la notificación.
   * @param body Cuerpo del mensaje.
   * @param data Datos adicionales opcionales.
   */
  async sendNotification(token: string, title: string, body: string, data?: Record<string, string>) {
    if (!token) {
      throw new BadRequestException('El token del dispositivo es obligatorio.');
    }

    const message = {
      notification: { title, body },
      //android: { notification: { icon: 'ic_launcher' } }, // Icono fijo
      data: data || {},
      token,
    };

    try {
      const response = await firebaseApp.messaging().send(message);
      console.log(`✅ Notificación enviada a ${token}:`, response);
      return { success: true, message: 'Notificación enviada', response };
    } catch (error) {
      console.error('❌ Error enviando notificación:', error);
      throw new InternalServerErrorException('No se pudo enviar la notificación.');
    }
  }

  /**
   * Envía notificaciones en lotes de hasta 500 dispositivos a la vez.
   * @param tokens Lista de tokens de dispositivos destino.
   * @param title Título de la notificación.
   * @param body Cuerpo del mensaje.
   * @param data Datos adicionales opcionales.
   */
  async sendNotificationToMultipleDevices(tokens: string[], title: string, body: string, data?: Record<string, string>) {
    if (!tokens || tokens.length === 0) {
      throw new BadRequestException('Se requiere al menos un token de dispositivo.');
    }
  
    let responses: admin.messaging.BatchResponse[] = [];
  
    for (let i = 0; i < tokens.length; i += this.MAX_TOKENS_PER_BATCH) {
      const batch = tokens.slice(i, i + this.MAX_TOKENS_PER_BATCH);
  
      const message = {
        notification: { title, body },
        //android: { notification: { icon: 'ic_launcher' } },
        data: data || {},
        tokens: batch,
      };
  
      try {
        const response = await firebaseApp.messaging().sendEachForMulticast(message);
        console.log(`✅ Notificación enviada a ${batch.length} dispositivos:`, response);
        responses.push(response);
      } catch (error) {
        console.error(`❌ Error enviando notificación al lote de ${batch.length}:`, error);
      }
    }
  
    return { success: true, message: 'Notificaciones enviadas en lotes', responses };
  }
  
}
