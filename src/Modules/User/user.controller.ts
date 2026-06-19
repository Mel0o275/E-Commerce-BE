import { Controller, Get, Patch, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthenticationGuard } from "src/common/guards/authentication/authentication.guard";
import { RoleEnum } from "src/common/enum/user.enum";
import { Token } from "src/common/decorators/token.decorator";
import { Auth } from "src/common/decorators/auth.decorator";
import type { Request } from 'express'
import { User } from "src/common/decorators/user.decorator";
import type { IUser } from "src/common/interface/user.interface";
import { FileInterceptor } from "@nestjs/platform-express";
import { ttl } from "src/common/decorators/ttl.decorator";
import { CustomCacheInterceptor } from "src/common/interceptors/cache.Interceptor";
// @SetMetadata("tokenType", TokenTypeEnum.TOKEN)
interface CustomRequest extends Request {
    user?: any;
    decoded?: { _id: string; jti: string; iat: number };
}
@Token()
@UseGuards(AuthenticationGuard)
@Controller("user")
export class UserController {
    constructor(private readonly UserService: UserService) {

    }

    @Auth([RoleEnum.USER, RoleEnum.ADMIN])
    // @Role([RoleEnum.ADMIN])
    // @UseGuards(AuthenticationGuard, AuthorizationGuard)
    @ttl(60)
    @Get()
    profile(@User() user: IUser) {
        return this.UserService.profile(user);
    }

    @Auth([RoleEnum.USER])
    @Patch("/profile-image")
    @UseInterceptors(FileInterceptor("file"))
    async profileImage(
        @User() user: IUser,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.UserService.profileImage(user, file);
    }

    @UseInterceptors(CustomCacheInterceptor)
    @Get("cache-test")
    async cacheTest() {
        console.log("DB");

        return {
            message: "from database",
            time: new Date().toISOString(),
        };
    }


    // router.patch("/profile-image", authentication(),
    // // cloudFileUpload({
    // //     validation: fieldValidation.image,
    // //     storageApproach: storageApproachEnum.Disk
    // // }).single("profileImage"),

    // async (req: CustomRequest, res: Response) => {
    //     // const image = await authSecurityService.profileImage(req.user, req.file as Express.Multer.File);
    //     // return res.json(req.file);
    //     try {
    //         // const image = await authSecurityService.profileImage(req.user, req.file as Express.Multer.File);
    //         const image = await authSecurityService.profileImage(req.body, req.user);
    //         res.status(200).json(image);
    //     } catch (error) {
    //         res.status(500).json({ message: "Error updating profile image", error: error });
    //     }
    // });

    // router.patch("/cover-images", authentication(), cloudFileUpload({
    //     validation: fieldValidation.image,
    //     storageApproach: storageApproachEnum.Disk,
    // }).array("coverImages", 2), async (req: CustomRequest, res: Response) => {
    //     // const images = await authSecurityService.coverImage(req.user, req.files as Express.Multer.File[]);
    //     // return res.json(req.files);
    //     try {
    //         if (!req.files || (req.files as Express.Multer.File[]).length > 2) {
    //             return res.status(400).json({
    //                 message: "You can upload maximum 2 images only"
    //             });
    //         }
    //         const images = await authSecurityService.coverImage(req.user, req.files as Express.Multer.File[]);
    //         res.status(200).json(images);
    //     } catch (error) {
    //         res.status(500).json({ message: "Error updating cover images", error: error });
    //     }
    // });
}