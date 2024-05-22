import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GetTaskRequest } from './get-task.request';

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export const GetTask = createParamDecorator(
  (context: ExecutionContext): GetTaskRequest => {
    const req = context.switchToHttp().getRequest();
    return new GetTaskRequest(req.user, req.params.id ?? null);
  },
);
