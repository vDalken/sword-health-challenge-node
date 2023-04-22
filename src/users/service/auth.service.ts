import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepositoryInterface } from '../repository/user.repository.interface';
import { Services } from '../../services.enum';

@Injectable()
export class AuthService {
  public constructor(
    @Inject(Services.UserRepository) private repository: UserRepositoryInterface,
  ) {}

  public async validateUser(apiToken: string): Promise<any> {
    const user = this.repository.findOneByApiKey(apiToken);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
