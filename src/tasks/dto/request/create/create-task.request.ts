import {
  IsNotEmpty, IsString, Length,
} from 'class-validator';
import { CreateTaskInterface } from './create-task.interface';
import { User } from '../../../../users/entity/user.entity';
import {
  AuthenticatedRequest,
} from '../../../../users/dto/request/auth/authenticated.request';

export class CreateTaskRequest extends AuthenticatedRequest implements CreateTaskInterface {
  @IsNotEmpty()
  @IsString()
  @Length(1, 2500)
  private readonly summary: string;

  public constructor(user: User, summary: string) {
    super(user);
    this.summary = summary;
  }

  public getSummary(): string {
    return this.summary;
  }
}
