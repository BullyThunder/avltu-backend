import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../../prisma/prisma.service';
import { MailModule } from 'src/mail/mail.module';
import { TokenService } from 'src/token/token.service';

@Module({
  imports: [
    PassportModule,
    MailModule,
    TokenService,
    JwtModule.register({
      secret:
        '74dcdd86743ab01aa8c9c1cfdb5dcb2ababf6514aa6894686c0091781b8de8af',
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
  exports: [AuthService],
})
export class AuthModule {}
