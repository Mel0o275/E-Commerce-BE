import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";

import { AuthenticationController } from "./authentication.controller";
import { AuthenticationService } from "./authentication.service";
import { UserRepo } from "src/common/repo/user.repo";
import { User, userSchema } from "src/DB/User/user.model";
import { OtpRepo } from "src/common/repo/otp.repo";
import { Otp, otpSchema } from "src/DB/OTP/otp.model";
import { TokenSecurity } from "src/common/security/token.security";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env.dev', '.env.prod'],
            isGlobal: true,
        }),

        MongooseModule.forFeature([
            { name: User.name, schema: userSchema },
            { name: Otp.name, schema: otpSchema },
        ]),
    ],
    controllers: [AuthenticationController],
    providers: [AuthenticationService, UserRepo, OtpRepo, TokenSecurity],
    exports: [AuthenticationService],
})
export class AuthenticationModule {}