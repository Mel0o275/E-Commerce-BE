import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { ICategory } from 'src/common/interface/category.interface';


@Schema({
    timestamps: true,
    collection: 'Category',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strict: true,
    strictQuery: true
})
export class Category implements ICategory {

    @Prop({ required: true })
    name!: string;

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

export const categorySchema = SchemaFactory.createForClass(Category);
export const CategoryModel = MongooseModule.forFeature([
    { name: Category.name, schema: categorySchema }
])
