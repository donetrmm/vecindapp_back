import { Controller, Post, Body, UnauthorizedException, UsePipes, ValidationPipe, Patch, Request, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

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
  @Post('fcm-token')
  async updateFcmToken(
    @Request() req,
    @Body() { fcmToken }: { fcmToken: string },
  ) {
    const userEmail = req.user.email; 
    return this.authService.registerFcmToken(userEmail, fcmToken);  
  }

  @ApiBearerAuth()
  @Delete('fcm-token')
  async removeFcmToken(
    @Request() req,
    @Body() { fcmToken }: { fcmToken: string },
  ) {
    const userEmail = req.user.email;
    return this.authService.removeFcmToken(userEmail, fcmToken);
  }
}
