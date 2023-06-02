import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

// I created this class to avoid using  "@UseGuards(AuthGuard('jwt'))" in all routes in my controllers which can be prone to error
@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {}
