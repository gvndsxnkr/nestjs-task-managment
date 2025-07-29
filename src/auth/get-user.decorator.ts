// import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// import { User } from './user.entity';

// export const GetUser = createParamDecorator(
//   (_data, ctx: ExecutionContext): User => {
//     const req = ctx.switchToHttp().getRequest();
//     return req.user;
//   },
// );

// get-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../auth/user.entity';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    console.log('Request User:', request.user); // Debugging line to check user
    return request.user; // 👈 Must be populated by AuthGuard
  },
);
