import { Injectable } from '@nestjs/common';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { RegistrDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { TokenService } from '../common/utils/generate_token';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private tokenService: TokenService,
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
      const userID = newUserCreate.id;
      await this.tokenService.createVerificationToken(userID);
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

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        email: findUser.email,
        id: findUser.id,
      },
    };
  }
  async activate(activationToken: string) {
    const token_data = await this.prisma.token.findUnique({
      where: { token: activationToken },
      include: { user: true },
    });
    if (!token_data) {
      throw new BadRequestException('Incorrect activation link');
    }
    await this.prisma.user.update({
      where: {},
    });
  }
}
