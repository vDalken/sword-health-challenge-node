import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CreateTaskRequest } from './create-task.request';

export const CreateTask = createParamDecorator(
  (data, ctx: ExecutionContext): CreateTaskRequest => {
    const req = ctx.switchToHttp().getRequest();
    return new CreateTaskRequest(
      req.user,
      req.body.summary ?? null,
    );
  },
);
