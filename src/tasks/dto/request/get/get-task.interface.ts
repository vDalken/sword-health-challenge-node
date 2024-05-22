import { AuthenticatedRequestInterface } from '../../../../users/dto/request/auth/authenticated.interface';

export interface GetTaskInterface extends AuthenticatedRequestInterface {
  getId(): number
}
