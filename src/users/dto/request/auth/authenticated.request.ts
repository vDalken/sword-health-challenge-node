import {
  IsNotEmpty, IsObject,
} from 'class-validator';
import { AuthenticatedRequestInterface } from './authenticated.interface';
import { User } from '../../../entity/user.entity';

export class AuthenticatedRequest implements AuthenticatedRequestInterface {
  @IsNotEmpty()
  @IsObject()
  private readonly user: User;

  public constructor(user: User) {
    this.user = user;
  }

  public getUser(): User {
    return this.user;
  }
}
