import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { GenderEnum, provider, RoleEnum } from 'src/common/enum/user.enum';
import { IUser } from 'src/common/interface/user.interface';
import { OtpDocument } from '../OTP/otp.model';

export type UserDocument = HydratedDocument<IUser>;

@Schema({
    timestamps: true,
    collection: 'Users',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strict: true,
    strictQuery: true
})
export class User implements IUser {

    @Prop({ required: true })
    firstName!: string;

    @Prop({
        required: function (this: any) {
            return this.provider === provider.LOCAL;
        },
    })
    lastName!: string;

    @Prop({
        required: function (this: any) {
            return this.provider === provider.LOCAL;
        },
    })
    password!: string;

    @Prop({ required: true, unique: true })
    email!: string;

    @Prop({ maxlength: 500 })
    bio?: string;

    // @Prop()
    // phone?: string;

    @Prop()
    profileImage?: string;

    @Prop({ type: [String] })
    coverImages?: string[];

    @Prop()
    DOB?: Date;

    @Prop()
    confirmedAt?: Date;

    @Prop({ enum: GenderEnum, default: GenderEnum.MALE })
    gender?: GenderEnum;

    @Prop({ enum: RoleEnum, default: RoleEnum.USER })
    role?: RoleEnum;

    @Prop({ enum: provider, default: provider.LOCAL })
    provider!: provider;
    

    @Prop({ default: false })
    isVerified?: boolean;

    @Prop()
    changeCredentialsTime?: Date;

    @Virtual()
    otp!:OtpDocument[]

    _id!: any;
    createdAt!: Date;
    updatedAt!: Date;
}

export const userSchema = SchemaFactory.createForClass(User);
export const UserModel = MongooseModule.forFeature([
    {name: User.name, schema: userSchema}
])

userSchema.virtual('otp', {
    localField: '_id',
    foreignField: 'createdBy',
    ref: 'Otp'
})
