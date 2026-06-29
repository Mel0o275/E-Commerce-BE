import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { IOrder } from 'src/common/interface/order.interface';
import {
    CurrencyTypeEnum,
    OrderStatuesEnum,
    PaymentTypeEnum,
} from 'src/common/enum/order.enum';
import { ICopoun } from 'src/common/interface/copoun.interface';

@Schema({ _id: false })
class OrderProduct {
    @Prop({
        type: Types.ObjectId,
        ref: 'Products',
        required: true,
    })
    productId!: Types.ObjectId;

    @Prop({ required: true })
    quantity!: number;

    @Prop({ required: true })
    unitAmount!: number;

    @Prop({ required: true })
    total!: number;
}

const OrderProductSchema = SchemaFactory.createForClass(OrderProduct);

@Schema({
    timestamps: true,
    collection: 'Orders',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strict: true,
    strictQuery: true,
})
export class Order implements IOrder {
    @Prop({
        required: true,
        unique: true,
    })
    OrderId!: string;

    @Prop()
    intentId?: string;

    @Prop()
    sessionId?: string;

    @Prop({ required: true })
    address!: string;

    @Prop({ required: true })
    phone!: string;

    @Prop()
    note?: string;

    @Prop({ required: true })
    discountPercentage!: number;

    @Prop({ required: true })
    subtotal!: number;

    @Prop({ required: true })
    total!: number;

    @Prop({
        type: Number,
        enum: PaymentTypeEnum,
        default: PaymentTypeEnum.CASH,
    })
    paymentType!: PaymentTypeEnum;

    @Prop({
        type: String,
        enum: CurrencyTypeEnum,
        default: CurrencyTypeEnum.EGP,
    })
    currency!: CurrencyTypeEnum;

    @Prop({
        type: Number,
        enum: OrderStatuesEnum,
        default: OrderStatuesEnum.PENDING,
    })
    status!: OrderStatuesEnum;

    @Prop({
        type: [OrderProductSchema],
        required: true,
    })
    products!: OrderProduct[];

    @Prop({type: Types.ObjectId, ref: 'Copouns', })
    copounId?: Types.ObjectId | ICopoun | undefined;

    @Prop()
    paidAt?: Date;

    @Prop()
    refundedAt?: Date;

    @Prop({
        type: {
            userId: {
                type: Types.ObjectId,
                ref: 'User',
            },
            time: {
                type: Date,
            },
            note: {
                type: String,
            },
        },
    })
    cancel?: {
        userId: Types.ObjectId;
        time: Date;
        note: string;
    };

    @Prop({ required: true })
    createdBy!: string;

    @Prop({ required: true })
    updatedBy!: string;

    @Prop({ default: false })
    isDeleted!: boolean;

    _id!: string;
    createdAt!: Date;
    updatedAt!: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

export const OrderModel = MongooseModule.forFeature([
    {
        name: Order.name,
        schema: OrderSchema,
    },
]);