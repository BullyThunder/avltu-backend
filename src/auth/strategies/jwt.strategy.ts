import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtPayload } from '../interfaces/jwt-payload.interface';
import { UsersService } from '../../users/users.service';
@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        '74dcdd86743ab01aa8c9c1cfdb5dcb2ababf6514aa6894686c0091781b8de8af',
    });
  }
  async validate(payload: jwtPayload) {
    const findUser = await this.usersService.findOne(Number(payload.sub));

    if (!findUser) {
      throw new UnauthorizedException();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...user } = findUser;
    return user;
  }
}
