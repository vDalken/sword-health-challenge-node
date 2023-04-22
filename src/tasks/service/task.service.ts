import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Services } from '../../services.enum';
import { TaskRepositoryInterface } from '../repository/task.repository.interface';
import { CreateTaskInterface } from '../dto/request/create/create-task.interface';
import { ListTaskInterface } from '../dto/request/list/list-task.interface';
import { Task } from '../entity/task.entity';
import { UserRepositoryInterface } from '../../users/repository/user.repository.interface';
import {
  CreateTaskNotification,
} from '../../notification/dto/request/create-task.notification';
import { TaskResponse } from '../dto/response/task.response';

@Injectable()
export class TaskService {
  public constructor(
    @Inject(Services.TaskRepository)
    private readonly taskRepository: TaskRepositoryInterface,
    @Inject(Services.UserRepository)
    private readonly userRepository: UserRepositoryInterface,
    @Inject(Services.ConsumerService)
    private readonly messageBus: ClientProxy,
    @Inject(Services.ListingLimit)
    private readonly listingLimit: number,
  ) {}

  public async createTask(request: CreateTaskInterface): Promise<TaskResponse> {
    const task = new Task(
      request.getSummary(),
      request.getUser(),
    );

    await this.taskRepository.persist(task);

    await this.messageBus.emit('', new CreateTaskNotification(
      request.getSummary(),
      request.getUser().getIdentifier(),
      new Date(),
    ));

    return new TaskResponse(task);
  }

  public async listTasks(request: ListTaskInterface): Promise<TaskResponse[]> {
    const user = request.getUser();
    const limit = Math.min(request.getLimit() ?? this.listingLimit, this.listingLimit);
    const offset = request.getOffset() ?? 0;

    const result = user.isManager()
      ? await this.taskRepository.listAllTasks(limit, offset)
      : await this.taskRepository.listAllTasksByUser(user, limit, offset);

    return result.map((task) => new TaskResponse(task));
  }
}