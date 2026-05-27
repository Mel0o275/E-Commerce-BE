import { Controller, Get, SetMetadata, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthenticationGuard } from "src/common/guards/authentication/authentication.guard";
import { TokenTypeEnum } from "src/common/enum/user.enum";
import { Token } from "src/common/decorators/token.decorator";

// @SetMetadata("tokenType", TokenTypeEnum.TOKEN)
@Token()
@UseGuards(AuthenticationGuard)
@Controller("user")
export class UserController {
    constructor(private readonly UserService:UserService) {
        
    }

    @Get()
    profile() {
        const user = this.UserService.profile()
        return{
            message: "Done",
            data : {user}
        }
    }
}