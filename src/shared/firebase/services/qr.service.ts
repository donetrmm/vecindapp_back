import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
const { Jimp } = require("jimp");

@Injectable()
export class QrService {
  async generateQrCode(text: string): Promise<string> {
    try {
      console.log(text)
      const qrBuffer = await QRCode.toBuffer(text, {
        errorCorrectionLevel: 'H',
        type: 'png',
        margin: 1,
        scale: 8
      });

      const base64Data = qrBuffer.toString('base64');
      return `data:image/png;base64,${base64Data}`;
    } catch (error) {
      throw new Error(`Error al generar el código QR: ${error.message}`);
    }
  }

  async decodeQrCode(base64QrCode: string): Promise<string> {
    try {
      const base64Data = base64QrCode.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
      
      const buffer = Buffer.from(base64Data, 'base64');
      
      const image = await Jimp.read(buffer);

      const qrCodeImageData = {
        data: new Uint8ClampedArray(image.bitmap.data),
        width: image.bitmap.width,
        height: image.bitmap.height
      };
      
      const jsQR = require('jsqr');
      const decodedQR = jsQR(qrCodeImageData.data, qrCodeImageData.width, qrCodeImageData.height);
      
      if (!decodedQR) {
        throw new Error('No se pudo decodificar el código QR');
      }
      
      return decodedQR.data;
    } catch (error) {
      throw new Error(`Error al decodificar el código QR: ${error.message}`);
    }
  }
}