// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { JwtService } from '@nestjs/jwt';
// import { Request } from 'express';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(private jwtService: JwtService, private reflector: Reflector) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
//       context.getHandler(),
//       context.getClass(),
//     ]);
//     if (isPublic) {
//       // 💡 See this condition
//       return true;
//     }
//     const request = context.switchToHttp().getRequest();
//     const token = this.extractTokenFromHeader(request);
//     if (!token) {
//       throw new UnauthorizedException();
//     }
//     try {
//       const payload = await this.jwtService.verifyAsync(token, {
//         secret: 'test',
//       });
//       // 💡 We're assigning the payload to the request object here
//       // so that we can access it in our route handlers
//       request['user'] = payload;
//     } catch {
//       throw new UnauthorizedException();
//     }
//     return true;
//   }

//   private extractTokenFromHeader(request: Request): string | undefined {
//     const [type, token] = request.headers.authorization?.split(' ') ?? [];
//     return type === 'Bearer' ? token : undefined;
//   }
// }

import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super({ defaultStrategy: 'jwt', property: 'currentUser' });
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const canActived = super.canActivate(context);
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']
      ? request.headers['authorization'].split(' ')[1]
      : null;

    if (!token) throw new UnauthorizedException('Please provide a valid token');

    request['accessToken'] = token;

    return canActived;
  }
}
