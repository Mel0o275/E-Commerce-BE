import { Module } from "@nestjs/common";
import { AuthenticationController } from "./authentication.controller";
import { SharedAuthModule } from "src/common/modules/shared.module";

@Module({
    imports: [
        SharedAuthModule
    ],
    controllers: [AuthenticationController],
    providers: [],
    exports: [],
})
export class AuthenticationModule { }