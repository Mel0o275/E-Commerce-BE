import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { GenderEnum, provider, RoleEnum } from 'src/common/enum/user.enum';
import { OtpDocument } from '../OTP/otp.model';
import { IBrand } from 'src/common/interface/brand.interface';


@Schema({
    timestamps: true,
    collection: 'Brands',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strict: true,
    strictQuery: true
})
export class Brand implements IBrand {

    @Prop({ required: true })
    name!: string;

    @Prop({
        required: true,
        unique: true
    })
    slug!: string;

    @Prop({ required: true })
    image!: string;

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

export const brandSchema = SchemaFactory.createForClass(Brand);
export const BrandModel = MongooseModule.forFeature([
    { name: Brand.name, schema: brandSchema }
])
