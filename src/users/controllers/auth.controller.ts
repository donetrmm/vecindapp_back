import { Controller, Post, Body, UnauthorizedException, UsePipes, ValidationPipe, Patch, Request, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente.' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto.email, registerDto.password);
  }

  @Post('login')
  @ApiOperation({ summary: 'Inicio de sesión del usuario' })
  @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso, retorna JWT.' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authService.login(loginDto.email, loginDto.password);
    if (!token) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return { access_token: token };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('fcm-token')
  @ApiOperation({ summary: 'Actualizar el token FCM del usuario' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fcmToken: { type: 'string', description: 'Token de Firebase Cloud Messaging (FCM)' },
      },
      required: ['fcmToken'],
    },
  })
  async updateFcmToken(
    @Request() req,
    @Body() { fcmToken }: { fcmToken: string },
  ) {
    const userEmail = req.user.email;
    return this.authService.registerFcmToken(userEmail, fcmToken);
  }
  
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('fcm-token')
  @ApiOperation({ summary: 'Eliminar el token FCM del usuario' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fcmToken: { type: 'string', description: 'Token de Firebase Cloud Messaging (FCM)' },
      },
      required: ['fcmToken'],
    },
  })
  async removeFcmToken(
    @Request() req,
    @Body() { fcmToken }: { fcmToken: string },
  ) {
    const userEmail = req.user.email;
    return this.authService.removeFcmToken(userEmail, fcmToken);
  }
}
