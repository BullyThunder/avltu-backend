import { Injectable } from '@nestjs/common';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { RegistrDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { TokenService } from 'src/token/token.service';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private tokenService: TokenService,
    private mailService: MailService,
  ) {}
  async getAllUsers() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullname: true,
        isActivated: true,
        createdAt: true,
      },
    });
  }
  async registr(dto: RegistrDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    try {
      const newUserCreate = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: passwordHash,
          fullname: dto.fullname,
        },
      });
      const verification = await this.tokenService.createVerificationToken(
        newUserCreate.id,
      );
      await this.mailService.sendActivationMail(
        newUserCreate.email,
        verification.token,
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _password, ...userWithoutPassword } = newUserCreate;

      return userWithoutPassword;
    } catch (error) {
      console.error('Registration error:', error);

      // Проверяем, что error — это объект, у которого могут быть свойства
      if (typeof error === 'object' && error !== null) {
        const err = error as Record<string, any>; // Говорим TS: "считай это объектом с любыми ключами"

        if (err.code === 'P2002') {
          throw new ConflictException('Email already taken');
        }

        throw new BadRequestException(
          err.message || 'Unknown registration error',
        );
      }

      // Если вдруг ошибка — это просто строка или что-то странное
      throw new BadRequestException('Unknown registration error');
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
    if (!token_data.user) {
      throw new BadRequestException('User not found');
    }
    await this.prisma.user.update({
      where: { id: token_data.userId },
      data: { isActivated: true },
    });
    await this.prisma.token.delete({
      where: { id: token_data.id },
    });
  }
}
