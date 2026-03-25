import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // 1. Создаем пул соединений, используя твой DATABASE_URL из .env
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    // 2. Создаем адаптер
    const adapter = new PrismaPg(pool);

    // 3. Передаем адаптер в родительский класс PrismaClient
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
