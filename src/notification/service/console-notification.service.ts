import { Inject, Injectable, Logger } from '@nestjs/common';
import { Services } from '../../services.enum';
import {
  UserRepositoryInterface,
} from '../../users/repository/user.repository.interface';
import {
  CreateTaskNotificationInterface,
} from '../dto/request/create-task.notification.interface';

@Injectable()
export class ConsoleNotificationService {
  public constructor(
    @Inject(Services.UserRepository)
    private readonly userRepository: UserRepositoryInterface,
    private readonly logger: Logger,
  ) {}

  public async processNotification(notification: CreateTaskNotificationInterface): Promise<void> {
    const managers = await this.userRepository.findAllManagers();
    managers.forEach(() => this.logger.log(notification));
  }
}
