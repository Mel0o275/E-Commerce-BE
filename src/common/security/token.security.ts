import jwt, { SignOptions } from "jsonwebtoken";


import { randomUUID } from "crypto";
import { RoleEnum, TokenTypeEnum } from "../enum/user.enum.js";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/DB/User/user.model.js";
import { UserRepo } from "../repo/user.repo.js";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
interface TokenPayload {
    _id: string;
    iat?: number;
    exp?: number;
    aud?: string;
    jti?: string;
}

interface TokenResult {
    token: string;
    refreshToken: string;
}
@Injectable()
export class TokenSecurity {
        constructor(private readonly UserRepo: UserRepo, private readonly config: ConfigService) { }


    generateToken(
        payload: object,
        secretKey: string,
        options?: SignOptions
    ): string {
        return jwt.sign(payload, secretKey, options);
    }

    getTokenSignature(role: RoleEnum) {
        let signture: string;
        let refreshsSignture: string;
        let audience: RoleEnum = RoleEnum.USER;

        switch (role) {
            case RoleEnum.ADMIN:
                signture = this.config.get<string>("SYSTEM_TOKEN_SECRET_KEY")!;
                refreshsSignture = this.config.get<string>("REFRESH_SYSTEM_TOKEN_SECRET_KEY")!;
                audience = RoleEnum.ADMIN;
                break;
            default:
                signture = this.config.get<string>("USER_TOKEN_SECRET_KEY")!;
                refreshsSignture = this.config.get<string>("REFRESH_USER_TOKEN_SECRET_KEY")!;
                audience = RoleEnum.USER;
                break;
        }

        return { signture, refreshsSignture, audience };
    }

    async createLoginCredentials(user: {
        _id: string;
        role: RoleEnum;
    }): Promise<TokenResult> {
        const { signture, refreshsSignture, audience } =
            this.getTokenSignature(user.role);

        const jwtId = randomUUID();

        const token = this.generateToken(
            { _id: user._id },
            signture,
            {
                expiresIn: "30m",
                audience: JSON.stringify({
                    tokenType: TokenTypeEnum.TOKEN,
                    role: audience,
                }),
                jwtid: jwtId,
            }
        );

        const refreshToken = this.generateToken(
            { _id: user._id },
            refreshsSignture,
            {
                expiresIn: "1y",
                audience: JSON.stringify({
                    tokenType: TokenTypeEnum.REFRESH,
                    role: audience,
                }),
                jwtid: jwtId,
            }
        );

        return { token, refreshToken };
    }

    async verifyToken(
        token: string,
        tokenType: TokenTypeEnum = TokenTypeEnum.TOKEN
    ) {
        const decodedRaw = jwt.decode(token) as TokenPayload;

        if (!decodedRaw || !decodedRaw.aud) {
            throw new UnauthorizedException("Invalid token");
        }

        const { tokenType: decodedType, role } = JSON.parse(decodedRaw.aud);

        if (decodedType !== tokenType) {
            throw new UnauthorizedException("Invalid token type");
        }

        const { signture, refreshsSignture } = this.getTokenSignature(role);

        const secret =
            tokenType === TokenTypeEnum.REFRESH
                ? refreshsSignture
                : signture;

        const verifiedPayload = jwt.verify(token, secret) as TokenPayload;

        const user = await this.UserRepo.findById(verifiedPayload._id);

        if (!user) {
            throw new UnauthorizedException("User not registered");
        }

        if (
            user.changeCredentialsTime &&
            user.changeCredentialsTime.getTime() >
            (verifiedPayload.iat || 0) * 1000
        ) {
            throw new UnauthorizedException("Token has been invalidated due to credential change");
        }

        return {
            tokenType,
            audience: role,
            verifiedPayload,
            user,
            decoded: decodedRaw,
        };
    }
}