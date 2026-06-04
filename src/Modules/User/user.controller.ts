import { Controller, Get, SetMetadata, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthenticationGuard } from "src/common/guards/authentication/authentication.guard";
import { RoleEnum } from "src/common/enum/user.enum";
import { Token } from "src/common/decorators/token.decorator";
import { Role } from "src/common/decorators/role.decorator";
import { AuthorizationGuard } from "src/common/guards/authentication/authorization.guard";
import { Auth } from "src/common/decorators/auth.decorator";

// @SetMetadata("tokenType", TokenTypeEnum.TOKEN)
@Token()
@UseGuards(AuthenticationGuard)
@Controller("user")
export class UserController {
    constructor(private readonly UserService:UserService) {
        
    }

    @Auth([RoleEnum.USER])
    // @Role([RoleEnum.ADMIN])
    // @UseGuards(AuthenticationGuard, AuthorizationGuard)
    @Get()
    profile() {
        const user = this.UserService.profile()
        return{
            message: "Done",
            data : {user}
        }
    }
}