import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('activate/:token')
  async activate(@Param('token') token: string) {
    return await this.authService.activate(token);
  }
  @Post('register')
  async register(@Body() dto: RegistrDto) {
    return await this.authService.registr(dto);
  }
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }
}
