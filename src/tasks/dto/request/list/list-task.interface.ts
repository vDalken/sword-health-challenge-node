import {
  AuthenticatedRequestInterface,
} from '../../../../users/dto/request/auth/authenticated.interface';

export interface ListTaskInterface extends AuthenticatedRequestInterface {
  getLimit(): number
  getOffset(): number
}
