import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { HydratedDocument } from 'mongoose';
import { Observable } from 'rxjs';
import { RoleEnum, TokenTypeEnum } from 'src/common/enum/user.enum';
import { IUser } from 'src/common/interface/user.interface';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const roles =
      this.reflector.getAllAndOverride<RoleEnum[]>(
        "roles",
        [
          context.getHandler(),
          context.getClass()
        ]
      ) ?? [RoleEnum.USER];

    let user!: HydratedDocument<IUser>;

    switch (context.getType()) {
      case 'http':
        user = context.switchToHttp().getRequest().credentials.user;
        break;
    }

    return roles.includes(user.role ?? RoleEnum.USER);
  }
}
