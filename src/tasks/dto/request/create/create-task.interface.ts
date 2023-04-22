import {
  AuthenticatedRequestInterface,
} from '../../../../users/dto/request/auth/authenticated.interface';

export interface CreateTaskInterface extends AuthenticatedRequestInterface {
  getSummary(): string
}
