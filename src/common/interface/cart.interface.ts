import { Types } from "mongoose";
import { GenderEnum, provider, RoleEnum } from "../enum/user.enum";
import { IProduct } from "./product.interface";
import { IUser } from "./user.interface";
export interface ICartProduct {
    productId: Types.ObjectId | IProduct;
    quantity: number;
}
export interface ICart {
    userId: Types.ObjectId | IUser | string;
    products: ICartProduct[];

}