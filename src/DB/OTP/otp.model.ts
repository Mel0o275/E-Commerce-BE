import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, HydratedDocument } from "mongoose";
import { OtpEnum } from "src/common/enum/otp.enum";

@Schema({timestamps: true})
export class Otp {
    @Prop({type: String, required: true})
    code!: string

    @Prop({type: Date, required: true})
    expiredAt!: Date;
    
    @Prop({type: Types.ObjectId, ref: 'User', required:true})
    createdBy!: Types.ObjectId

    @Prop({type: String, enum: OtpEnum, required:true})
    type!:OtpEnum
}

export type OtpDocument = HydratedDocument<Otp>
export const otpSchema = SchemaFactory.createForClass(Otp)
otpSchema.index({expiredAt:1}, {expireAfterSeconds: 0})
export const OtpModel = MongooseModule.forFeature([{name:Otp.name, schema: otpSchema}])