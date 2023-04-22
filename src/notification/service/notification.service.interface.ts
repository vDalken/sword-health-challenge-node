import {
  CreateTaskNotificationInterface,
} from '../dto/request/create-task.notification.interface';

export interface NotificationServiceInterface {
  processNotification(notification: CreateTaskNotificationInterface): Promise<void>
}
