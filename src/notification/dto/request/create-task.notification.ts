import {
  CreateTaskNotificationInterface,
} from './create-task.notification.interface';

export class CreateTaskNotification implements CreateTaskNotificationInterface {
  public constructor(
    private readonly message: string,
    private readonly userId: string,
    private readonly createdAt: Date,
  ) {
  }

  public getMessage(): string {
    return this.message;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getCompletionDate(): Date {
    return this.createdAt;
  }

  public toString(): string {
    return `${this.getCompletionDate()} - User ${this.getUserId()} performed: ${this.getMessage()}`;
  }
}
