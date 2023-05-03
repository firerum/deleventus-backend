import { AuthGuard } from '@nestjs/passport';

// I created this class to avoid using  "@UseGuards(AuthGuard('jwt'))" in all routes in my controllers which can be prone to error
export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
