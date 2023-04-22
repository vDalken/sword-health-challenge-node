import Strategy from 'passport-unique-token';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { User } from '../entity/user.entity';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'apiKey') {
  public constructor(private authService: AuthService) {
    super({
      tokenHeader: 'Authorization',
      failOnMissing: true,
    });
  }

  public async validate(apiToken: string): Promise<User> {
    return this.authService.validateUser(apiToken);
  }
}
