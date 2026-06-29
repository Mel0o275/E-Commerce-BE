import { Types } from "mongoose";
import { CurrencyTypeEnum, OrderStatuesEnum, PaymentTypeEnum } from "../enum/order.enum";
import { IUser } from "./user.interface";
import { IProduct } from "./product.interface";
import { ICopoun } from "./copoun.interface";

export interface IOrderProduct {
    productId: Types.ObjectId | IProduct;
    quantity: number;
    unitAmount: number;
    total: number
}

export interface IOrder {
    intentId?: string;
    sessionId?: string;
    OrderId: string;

    address: string;
    phone: string;
    note?: string;

    total:number;
    discountPercentage:number;
    subtotal:number

    status:OrderStatuesEnum;
    paymentType:PaymentTypeEnum;
    currency:CurrencyTypeEnum

    cancel?: {userId:Types.ObjectId | IUser, time:Date, note:string};

    copounId?: Types.ObjectId | ICopoun 

    paidAt?:Date;
    refundedAt?:Date;

    products: IOrderProduct[]

    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
    isDeleted: boolean;

}