import { Injectable } from '@nestjs/common';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegistrDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async registr(dto: RegistrDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    try {
      const newUserCreate = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: passwordHash,
          name: dto.name,
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _password, ...userWithoutPassword } = newUserCreate;
      return userWithoutPassword;
    } catch {
      throw new ConflictException('Email is already taken');
    }
  }
  async login(dto: LoginDto) {
    const findUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!findUser) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const isMatch = await bcrypt.compare(dto.password, findUser.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const payload = { email: findUser.email, sub: findUser.id };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        email: findUser.email,
        id: findUser.id,
      },
    };
  }
}
