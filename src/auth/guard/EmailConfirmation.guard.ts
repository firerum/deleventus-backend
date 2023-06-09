import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

// I created this class to ensure only verified user can access certain routes in the controllers
//TODO try to understand how this code really works under the hood
@Injectable()
export class EmailConfirmationGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (!request.user.is_verified) {
      throw new UnauthorizedException('Pending Account. Verify Your Email');
    }
    return true;
  }
}
