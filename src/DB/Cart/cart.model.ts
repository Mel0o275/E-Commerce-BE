import { MongooseModule, Prop, raw, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { GenderEnum, provider, RoleEnum } from 'src/common/enum/user.enum';
import { OtpDocument } from '../OTP/otp.model';
import { ICart, ICartProduct } from 'src/common/interface/cart.interface';
import { Types } from 'mongoose';
import { IUser } from 'src/common/interface/user.interface';
import { min } from 'class-validator';


@Schema({
    timestamps: true,
    collection: 'Carts',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strict: true,
    strictQuery: true
})
export class Cart implements ICart {

    @Prop({ required: true, type: Types.ObjectId, ref: "Users" })
    userId!: Types.ObjectId | IUser | string;

    @Prop([raw({
        productId: {type: Types.ObjectId, ref: "Products", required: true},
        quantity: {type: Number, min: 0, default: 1, required: true}
    })])

    products!: ICartProduct[];



    _id!: string;
    createdAt!: Date;
    updatedAt!: Date;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
export const CartModel = MongooseModule.forFeature([
    { name: Cart.name, schema: CartSchema }
])
