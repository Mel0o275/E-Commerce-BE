import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TokenSecurity } from "src/common/security/token.security";
import { UserRepo } from "src/common/repo/user.repo";
import { OtpRepo } from "src/common/repo/otp.repo";
import { User, userSchema } from "src/DB/User/user.model";
import { MongooseModule } from "@nestjs/mongoose";
import { Otp, otpSchema } from "src/DB/OTP/otp.model";
import { S3Service } from "src/common/services/s3.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: userSchema },
            { name: Otp.name, schema: otpSchema },
        ]),
    ], exports: [UserService],
    controllers: [UserController],
    providers: [UserService, TokenSecurity, UserRepo, OtpRepo, S3Service],
})

export class UserModule {
    constructor() {

    }
}