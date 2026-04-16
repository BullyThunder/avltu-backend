import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Проверь путь до своей призмы
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TokenService {
  constructor(private prisma: PrismaService) {}

  async createVerificationToken(userId: number) {
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Токен живет 24 часа

    return await this.prisma.token.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }
}
