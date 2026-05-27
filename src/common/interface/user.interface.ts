import { GenderEnum, provider, RoleEnum } from "../enum/user.enum";

export interface IUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    bio?: string;
    // phone?: string;
    profileImage?: string;
    coverImages?: string[];
    DOB?: Date;
    confirmedAt?: Date;
    gender?: GenderEnum;
    role?: RoleEnum;
    provider: provider;
    changeCredentialsTime?: Date;
    isVerified?: boolean;
    createdAt: Date;
    updatedAt: Date;
}