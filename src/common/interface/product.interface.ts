import { Types } from "mongoose";

export interface IProduct {
    _id: string;
    name: string;
    price: number;
    description: string;
    rating?: number;
    image: string;
    brandId: Types.ObjectId;
    categoryId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
    isDeleted: boolean;

}