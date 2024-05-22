import { AuthenticatedRequest } from 'src/users/dto/request/auth/authenticated.request';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { User } from 'src/users/entity/user.entity';
import { GetTaskInterface } from './get-task.interface';

export class GetTaskRequest
  extends AuthenticatedRequest
  implements GetTaskInterface {
  @IsNotEmpty()
  @IsNumber()
  private readonly id: number;

  public constructor(user: User, id: number) {
    super(user);
    this.id = id;
  }

  public getId(): number {
    return this.id;
  }
}
