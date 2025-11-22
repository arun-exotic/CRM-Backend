import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ClsService } from 'nestjs-cls'; 

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly cls: ClsService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    
    const can = (await super.canActivate(context)) as boolean;
    if (!can) return false;

   
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (user) {
      this.cls.set('userId', user.userId);
      this.cls.set('userRole', user.role);
    }

    return true;
  }
}
