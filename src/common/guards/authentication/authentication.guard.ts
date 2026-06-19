import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { TokenTypeEnum } from 'src/common/enum/user.enum';
import { TokenSecurity } from 'src/common/security/token.security';

@Injectable()
export class AuthenticationGuard implements CanActivate {
    constructor(private readonly tokenSecurity: TokenSecurity, private readonly reflecor: Reflector) {}

  async canActivate(
    context: ExecutionContext,
  ):Promise<boolean> {

    const tokenType : TokenTypeEnum = this.reflecor.getAllAndOverride<TokenTypeEnum>("tokenType", 
      [context.getClass()]
    )?? TokenTypeEnum.TOKEN;
    console.log({context, tokenType});
    // const req = context.switchToHttp().getRequest()
    const type = context.getType<'http' | 'graphql' | 'ws'>()
    console.log(type);
    let authorization : string = ''
    let req! : any
    switch (type) {
      case 'http':
        const ctx = context.switchToHttp()
        req = ctx.getRequest()
        authorization = req.headers.authorization
        break;

      case 'graphql':
        req = GqlExecutionContext.create(context).getContext().req
        authorization = req.headers.authorization
        break;


      default:
        break;
    }

    if(!authorization) return false

    const {decoded, user} = await this.tokenSecurity.verifyToken(authorization, tokenType)
    req.credentials = {decoded, user}
    return true;
  }
}
