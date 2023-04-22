import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './controller/task.controller';
import { TaskRepositoryORM } from './repository/task.repository.orm';
import { Services } from '../services.enum';
import { TaskService } from './service/task.service';
import { Task } from './entity/task.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    UsersModule,
  ],
  controllers: [TaskController],
  providers: [
    Logger,
    TaskService,
    TaskRepositoryORM,
    {
      provide: Services.TaskRepository,
      useClass: TaskRepositoryORM,
    },
  ],
})
export class TasksModule {}
