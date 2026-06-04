import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { createClient } from "redis";
import { AuthenticationController } from "src/Modules/Authentication/authentication.controller";
import { AuthenticationService } from "src/Modules/Authentication/authentication.service";
import { UserRepo } from "../repo/user.repo";
import { OtpRepo } from "../repo/otp.repo";
import { TokenSecurity } from "../security/token.security";
import { RedisService } from "../services/redis.service";
import { User, userSchema } from "src/DB/User/user.model";
import { Otp, otpSchema } from "src/DB/OTP/otp.model";

@Module({
    imports: [
        ConfigModule,

        MongooseModule.forFeature([
            { name: User.name, schema: userSchema },
            { name: Otp.name, schema: otpSchema },
        ]),
    ],

    controllers: [AuthenticationController],

    providers: [
        {
            provide: "Redis_Client",
            useFactory: async (configService: ConfigService) => {
                const client = createClient({
                    url: configService.get<string>("REDIS_URL"),
                });

                client.on("error", (err) => {
                    console.error(err);
                });

                await client.connect();

                console.log("Redis Connected");

                return client;
            },
            inject: [ConfigService],
        },

        AuthenticationService,
        UserRepo,
        OtpRepo,
        TokenSecurity,
        RedisService,
    ],

    exports: [
        "Redis_Client",
        RedisService,
        AuthenticationService,
        TokenSecurity,
    ],
})
export class SharedAuthModule {}