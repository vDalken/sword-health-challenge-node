import { Logger, Module } from '@nestjs/common';
import { NotificationConsumer } from './consumer/notification.consumer';
import { ConsoleNotificationService } from './service/console-notification.service';
import { UsersModule } from '../users/users.module';
import { Services } from '../services.enum';

@Module({
  imports: [UsersModule],
  controllers: [NotificationConsumer],
  providers: [
    Logger,
    ConsoleNotificationService,
    {
      provide: Services.NotificationService,
      useClass: ConsoleNotificationService,
    },
  ],
})
export class NotificationsModule {}
