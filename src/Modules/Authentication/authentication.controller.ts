import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { LoginDto, signupDto } from "./dto/authentication.dto";
import { VerifyOtpDto } from "./dto/verifyOtp.dto";

@Controller("/auth")
export class AuthenticationController {
    constructor(private readonly AuthenticationService: AuthenticationService) { }

    @Post("signup")
    signup(
        @Body(
            ValidationPipe
        ) body: signupDto
    ) {
        const user = this.AuthenticationService.signUp(body)
        return user
    }

    @Post("verify-otp")
    async verifyOtp(@Body() body: VerifyOtpDto) {
        return this.AuthenticationService.verifyOtpService(
            body.email,
            body.otp
        );
    }

    @Post("login")
    login(
        @Body(
            ValidationPipe
        ) body: LoginDto
    ) {
        const user = this.AuthenticationService.login(body)
        return user
    }

    @Post("forget-password")
    async forgetPassword(@Body() body) {
        return await this.AuthenticationService.forgetPassword(body.email);
    }

    @Post("signup/gmail")
    async googleSignup(@Body() body) {
        return await this.AuthenticationService.signUpWithGoogleAccount(body.idToken);
    }

    @Post("login/gmail")
    async googleLogin(@Body() body) {
        return await this.AuthenticationService.loginWithGoogle(body.idToken);
    }
}