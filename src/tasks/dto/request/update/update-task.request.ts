import { AuthenticatedRequest } from 'src/users/dto/request/auth/authenticated.request';
import {
  IsNotEmpty, IsString, Length, IsNumber,
} from 'class-validator';
import { User } from 'src/users/entity/user.entity';
import { UpdateTaskInterface } from './update-task.interface';

export class UpdateTaskRequest
  extends AuthenticatedRequest
  implements UpdateTaskInterface {
  @IsNotEmpty()
  @IsString()
  @Length(1, 2500)
  private readonly summary: string;

  @IsNotEmpty()
  @IsNumber()
  private readonly id: number;

  public constructor(user: User, id: number, summary: string) {
    super(user);
    this.summary = summary;
    this.id = id;
  }

  public getSummary(): string {
    return this.summary;
  }

  public getId(): number {
    return this.id;
  }
}
