import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { PrismaModule } from '../prisma/prisma.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [AuthModule, UsersModule, OrdersModule, PrismaModule, MailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
