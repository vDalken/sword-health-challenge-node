import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { UserRepositoryInterface } from './user.repository.interface';
import { Role } from '../entity/role.enum';

@Injectable()
export class UserRepositoryORM implements UserRepositoryInterface {
  public constructor(
    @InjectRepository(User) private entityManager: Repository<User>,
  ) {}

  public async persist(entity: User): Promise<User> {
    return this.entityManager.save(entity);
  }

  public async findOneByApiKey(value: string): Promise<User> {
    return this.entityManager.findOneBy({ apiKey: value });
  }

  public async findAllManagers(): Promise<User[]> {
    return this.entityManager
      .createQueryBuilder('user')
      .where('user.roles like :role')
      .setParameter('role', Role.Manager)
      .getMany();
  }
}
