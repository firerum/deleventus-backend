import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// I created this custom decorator to get the 'req.user' instead of using '@Req() req: Request' from Express in my controllers. This is good should I want to use another framework
export const UserRequestObject = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
