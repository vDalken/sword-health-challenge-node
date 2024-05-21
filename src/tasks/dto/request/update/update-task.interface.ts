import { AuthenticatedRequestInterface } from 'src/users/dto/request/auth/authenticated.interface'

export interface UpdateTaskInterface extends AuthenticatedRequestInterface {
  getSummary(): string
  getId() : number
}
