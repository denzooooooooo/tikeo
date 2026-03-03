import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Optional JWT guard - does NOT throw if no token is provided.
 * If a valid token is present, req.user is populated.
 * If no token or invalid token, req.user remains undefined.
 * Use this for endpoints that are public but need to know the user if logged in.
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    // Don't throw on error or missing user - just return null
    return user || null;
  }
}
