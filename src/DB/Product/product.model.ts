import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { IProduct } from 'src/common/interface/product.interface';
import { Brand } from '../Brand/brand.model';
import { Category } from '../Category/category.model';


@Schema({
    timestamps: true,
    collection: 'Products',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strict: true,
    strictQuery: true
})
export class Product implements IProduct {

    @Prop({ required: true })
    name!: string;

    @Prop({
        required: true,
        min: 1
    })
    price!: number;

    @Prop({ required: true })
    description!: string;

    @Prop({ required: true })
    image!: string;

    rating?: number | undefined;

    @Prop({
        type: Types.ObjectId,
        ref: Brand.name,
        required: true,
    })
    brandId!: Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
        ref: Category.name,
        required: true,
    })
    categoryId!: Types.ObjectId;

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

export const productSchema = SchemaFactory.createForClass(Product);
export const ProductModel = MongooseModule.forFeature([
    { name: Product.name, schema: productSchema }
])
