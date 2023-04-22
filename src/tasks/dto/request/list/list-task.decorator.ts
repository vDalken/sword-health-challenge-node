import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ListTaskRequest } from './list-task.request';

export const ListTask = createParamDecorator(
  (data, ctx: ExecutionContext): ListTaskRequest => {
    const req = ctx.switchToHttp().getRequest();
    return new ListTaskRequest(
      req.user,
      req.query.limit ?? null,
      req.query.offset ?? null,
    );
  },
);
