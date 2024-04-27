import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UnauthorizedException, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'userName',
      passwordField: 'password',
    });
  }

  async validate(userName: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(userName, password);
    if (!user) {
      throw new UnauthorizedException('Invalid Credentials!');
    }
    return user;
  }
}
