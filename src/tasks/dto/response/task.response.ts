import { Task } from '../../entity/task.entity';

export class TaskResponse {
  private readonly id?: number;

  private readonly summary?: string;

  private readonly createdAt?: Date;

  private readonly updatedAt?: Date;

  private readonly userId?: string;

  public constructor(entity: Task) {
    this.id = entity.getIdentifier();
    this.userId = entity.getUser()?.getIdentifier();
    this.summary = entity.getSummary();
    this.createdAt = entity.getCreatedAt();
    this.updatedAt = entity.getUpdatedAt();
  }
}
