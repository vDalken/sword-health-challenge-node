import { User } from '../entity/user.entity';

export interface UserRepositoryInterface {
  findOneByApiKey(value: string): Promise<User>;
  findAllManagers(): Promise<User[]>
  persist(value: User): Promise<User>;
}
