import { IsMongoId, IsNumber, IsPositive, Min } from "class-validator";
import { Types } from "mongoose";
import { ICartProduct } from "src/common/interface/cart.interface";

export class CreateCartDto implements Partial<ICartProduct> {
    @IsMongoId()
    productId!: Types.ObjectId

    @IsNumber()
    quantity!:number
}
