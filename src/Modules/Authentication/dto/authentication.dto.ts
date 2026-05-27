// import {z} from "zod"
// import { signup } from "../authentication.validation"
// export type SignUpDTO = z.infer<typeof signup>

import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword, Length, Matches, ValidateIf } from "class-validator";
import { IsMatch } from "src/common/decorators/match.decorator";

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsStrongPassword()
    @IsNotEmpty()
    password!: string;

    @IsOptional()
    @IsString()
    FCM?: string
}


export class signupDto extends LoginDto {
    @Length(2, 20)
    @IsString()
    firstName!: string

    @Length(2, 20)
    @IsString()
    lastName!: string

    // @Validate(MatchBetweenFields)
    @ValidateIf((object: signupDto) => {
        return Boolean(object.password)
    })
    @IsMatch(['password'])
    confirmPassword!: string

    @Matches(/^\+?[1-9]\d{1,14}$/)
    phone?: string

}