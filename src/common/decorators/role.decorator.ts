import { SetMetadata } from "@nestjs/common"
import { RoleEnum, TokenTypeEnum } from "../enum/user.enum"

export const Role = (roles: RoleEnum[]) => {
    return SetMetadata('roles', roles)
}