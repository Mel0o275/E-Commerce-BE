import { GenderEnum, provider, RoleEnum } from "../enum/user.enum";

export interface IBrand {
    _id: string;
    name: string;
    slug?: string;
    image: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
    isDeleted: boolean;

}