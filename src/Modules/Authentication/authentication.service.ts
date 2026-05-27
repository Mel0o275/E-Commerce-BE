import { ConflictException, Injectable } from "@nestjs/common";
import { LoginDto, signupDto } from "./dto/authentication.dto";
import { IUser } from "src/common/interface/user.interface";
import { compareHash, generateHash } from "src/common/security/hash.security";
import { sendOtpEmail, sendResetPasswordEmail } from "src/common/utils/otp/email.otp";
import { set } from "src/common/services/redis.service";
import { UserRepo } from "src/common/repo/user.repo";
import { OtpRepo } from "src/common/repo/otp.repo";
import { OtpEnum } from "src/common/enum/otp.enum";
import { randomInt, randomUUID } from "node:crypto";
import { TokenSecurity } from "src/common/security/token.security";
import { provider, RoleEnum } from "src/common/enum/user.enum";
import { USER_TOKEN_SECRET_KEY } from "src/config/config";
import { ConfigService } from "@nestjs/config";
import { OAuth2Client } from "google-auth-library";

export interface SignUpResponse {
    message: string;
    user: Partial<IUser>;
}

@Injectable()
export class AuthenticationService {
    constructor(private readonly UserRepo: UserRepo, private readonly OtpRepo: OtpRepo, private readonly TokenSecurity: TokenSecurity, private readonly config: ConfigService) { }

    // ================= SIGN UP =================
    async signUp(inputs: signupDto): Promise<SignUpResponse> {
        const { firstName, lastName, email, password, phone } = inputs;

        const exist = await this.UserRepo.findOne({ email });
        if (exist) throw new ConflictException("email already exists");
        const hashedPassword = await generateHash(password);

        const user = await this.UserRepo.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            isVerified: false,
        });

        // OTP
        const code = randomInt(1000, 9999).toString();
        const hashedOtp = await generateHash(code);

        const otpDoc = await this.OtpRepo.create({
            code: hashedOtp,
            expiredAt: new Date(Date.now() + 2 * 60 * 1000),
            createdBy: user._id,
            type: OtpEnum.ConfirmEmail
        });

        await sendOtpEmail(email, code);
        // const otp = Math.floor(1000 + Math.random() * 9000).toString();
        // const otpHash = await generateHash(otp);

        // const redisKey = `otp_${user._id}`;
        // await set(redisKey, otpHash, 5 * 60);

        return {
            message: "User created. OTP sent.",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isVerified: user.isVerified,
            }
        };
    }

    // ================= VERIFY OTP =================
    async verifyOtpService(email: string, otp: string) {
        const user = await this.UserRepo.findOne({ email });

        if (!user) throw new Error("User not found");

        if (user.isVerified) {
            return { message: "Already verified" };
        }

        const otpDoc = await this.OtpRepo.findOne({
            createdBy: user._id,
            type: OtpEnum.ConfirmEmail
        });

        if (!otpDoc) {
            throw new ConflictException("OTP expired");
        }

        const isValid = await compareHash(otp, otpDoc.code);
        if (!isValid) throw new ConflictException("Invalid OTP");

        if (otpDoc.expiredAt < new Date()) {
            throw new ConflictException("OTP expired");
        }

        user.isVerified = true;
        await user.save();

        return {
            message: "Account verified",
            user: {
                _id: user._id,
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                isVerified: user.isVerified,
            }
        };
    }

    // ================= LOGIN =================
    async login(inputs: LoginDto) {
        const { email, password, FCM } = inputs;

        const user = await this.UserRepo.findOne({ email });
        if (!user) throw new ConflictException("Invalid credentials");

        if (!user.isVerified) {
            throw new ConflictException("Email not verified");
        }

        // const attemptsKey = `login_attempts_${email}`;
        // const attempts = Number(await get(attemptsKey)) || 0;

        // if (attempts >= 5) {
        //     const time = await ttl(attemptsKey);
        //     throw new Error(`Try again after ${time}s`);
        // }

        const isValid = await compareHash(password, user.password);
        if (!isValid) {
            // await set(attemptsKey, (attempts + 1).toString(), 5 * 60);
            throw new ConflictException("Invalid credentials");
        }

        // if (FCM) {
        //     await addFCM(user._id, FCM);
        //     const tokens = await getFCMs(user._id)

        //     await this.fcmService.sendNotifications({
        //         tokens,
        //         title: "New Login Detected",
        //         body: "A new login to your account was detected. If this was you, you can ignore this message. If not, please secure your account immediately."
        //     });
        // }

        const { token, refreshToken } =
            await this.TokenSecurity.createLoginCredentials({
                _id: user._id.toString(),
                role: user.role || RoleEnum.USER
            });
        return { token, refreshToken };
    }

    // ================= FORGET PASSWORD =================
    async forgetPassword(email: string) {
        const user = await this.UserRepo.findOne({ email });
        if (!user) throw new ConflictException("User not found");

        const token = this.TokenSecurity.generateToken(
            {
                email,
                type: OtpEnum.ResetPassword
            },
            this.config.get<string>("USER_TOKEN_SECRET_KEY")!,
            { expiresIn: "1h" }
        );

        const link = `http://localhost:5173/reset-password?token=${token}`;

        await sendResetPasswordEmail(email, link);

        return { message: "Reset link sent" };
    }

    async signUpWithGoogleAccount(idToken: string): Promise<{ message: string; user?: IUser }> {
        try {
            const client = new OAuth2Client('822248230063-aeiq4udlj5l4lpnno4j1di5vepbesfs3.apps.googleusercontent.com');
            const ticket = await client.verifyIdToken({
                idToken,
                audience: '822248230063-aeiq4udlj5l4lpnno4j1di5vepbesfs3.apps.googleusercontent.com'
            });

            const payload = ticket.getPayload();
            console.log("Google Payload:", payload);

            if (!payload || !payload.email_verified || !payload.email) {
                return { message: 'Email not verified by Google' };
            }
            const email = payload.email;
            const exist = await this.UserRepo.findOne({ email });

            if (exist) {
                if (exist.provider === provider.LOCAL) {
                    return { message: "User exists as LOCAL account. Please login with email/password." };
                }
                const user = await this.loginWithGoogle(idToken);
                return { message: "Login successful", user };
            }

            const firstName = payload.given_name ?? "";
            const lastName = payload.family_name ?? "";

            const newUser = await this.UserRepo.create({
                firstName,
                lastName,
                email: payload.email,
                provider: provider.GOOGLE,
                isVerified: true,
            });

            return { message: "Signup successful", user: newUser };

        } catch (error: any) {
            console.error('Google Signup Error:', error);
            return { message: 'Error processing Google signup' };
        }
    }

    async loginWithGoogle(idToken: string): Promise<any> {
        const client = new OAuth2Client('822248230063-aeiq4udlj5l4lpnno4j1di5vepbesfs3.apps.googleusercontent.com');
        const ticket = await client.verifyIdToken({
            idToken,
            audience: '822248230063-aeiq4udlj5l4lpnno4j1di5vepbesfs3.apps.googleusercontent.com'
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email_verified || !payload.email) {
            throw new Error('Email not verified by Google');
        }

        const exist = await this.UserRepo.findOne({ email: payload.email });
        if (!exist || exist.provider !== provider.GOOGLE) {
            throw new Error('Invalid provider, please login with your email and password');
        }

        return await this.TokenSecurity.createLoginCredentials({
                _id: exist._id.toString(),
                role: exist.role || RoleEnum.USER
            });
    }
}