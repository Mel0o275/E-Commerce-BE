import { applyDecorators, UseGuards } from "@nestjs/common"
import { Token } from "./token.decorator"
import { RoleEnum, TokenTypeEnum } from "../enum/user.enum"
import { Role } from "./role.decorator"
import { AuthenticationGuard } from "../guards/authentication/authentication.guard"
import { AuthorizationGuard } from "../guards/authentication/authorization.guard"

export const Auth = (roles: RoleEnum[], type: TokenTypeEnum= TokenTypeEnum.TOKEN) => {
    return applyDecorators(
        Token(type),
        Role(roles),
        UseGuards(AuthenticationGuard, AuthorizationGuard)
    )
}