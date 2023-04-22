import { Controller, Inject } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import {
  CreateTaskNotificationInterface,
} from '../dto/request/create-task.notification.interface';
import { CreateTaskNotification } from '../dto/request/create-task.notification';
import {
  NotificationServiceInterface,
} from '../service/notification.service.interface';
import { Services } from '../../services.enum';

@Controller()
export class NotificationConsumer {
  public constructor(
    @Inject(Services.NotificationService)
    private readonly service: NotificationServiceInterface,
  ) {
  }

  @EventPattern('')
  public async handle(data: Record<string, CreateTaskNotificationInterface>) {
    const notification = new CreateTaskNotification(
      String(data.message),
      String(data.userId),
      new Date(String(data.createdAt)),
    );
    return this.service.processNotification(notification);
  }
}
