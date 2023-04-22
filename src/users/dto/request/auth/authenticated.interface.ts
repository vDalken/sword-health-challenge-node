import { User } from '../../../entity/user.entity';

export interface AuthenticatedRequestInterface {
  getUser(): User
}
