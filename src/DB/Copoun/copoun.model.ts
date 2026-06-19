import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { ICopoun } from 'src/common/interface/copoun.interface';
import { CopounType, CopounUsage } from 'src/common/enum/copoun.enum';


@Schema({
    timestamps: true,
    collection: 'Copoun',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strict: true,
    strictQuery: true
})
export class Copoun implements ICopoun {

    @Prop({ required: true })
    name!: string;

    @Prop({ required: true, type:Date })
    endDate!: Date;
    @Prop({ required: true, type:Date })
    startDate!: Date;

    @Prop({type: Number, required: false})
    percentage?: number;
    @Prop({type: Number, required: false})
    amount?: number;

    @Prop({ required: true, enum: CopounType })
    copounType!: CopounType;

    @Prop({ required: true, enum: CopounUsage })
    copounUsage!: CopounUsage;


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

export const Copounchema = SchemaFactory.createForClass(Copoun);
export const CopounModel = MongooseModule.forFeature([
    { name: Copoun.name, schema: Copounchema }
])
