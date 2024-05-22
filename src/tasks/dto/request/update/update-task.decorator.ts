import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UpdateTaskRequest } from './update-task.request'

export const UpdateTask = createParamDecorator((context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest()
  return new UpdateTaskRequest(req.user,req.body.id, req.body.summary ?? null)
})
