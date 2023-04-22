import {
  IsInt,
  IsOptional, IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ListTaskInterface } from './list-task.interface';
import { User } from '../../../../users/entity/user.entity';
import {
  AuthenticatedRequest,
} from '../../../../users/dto/request/auth/authenticated.request';

export class ListTaskRequest extends AuthenticatedRequest implements ListTaskInterface {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  private readonly limit?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  private readonly offset?: number;

  public constructor(user: User, limit?: number, offset?: number) {
    super(user);
    this.limit = limit ?? null;
    this.offset = offset ?? null;
  }

  public getLimit(): number | null {
    return this.limit;
  }

  public getOffset(): number | null {
    return this.offset;
  }
}
