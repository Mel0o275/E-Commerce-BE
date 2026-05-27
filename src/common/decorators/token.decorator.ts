import { SetMetadata } from "@nestjs/common"
import { TokenTypeEnum } from "../enum/user.enum"

export const Token = (type:TokenTypeEnum= TokenTypeEnum.TOKEN) => {
    return SetMetadata('tokenType', type)
}