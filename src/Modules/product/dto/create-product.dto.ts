import {
        IsNotEmpty,
        IsString,
        MinLength,
        IsNumber,
        IsOptional,
        Min,
        IsMongoId,
        Max,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateProductDto {

        @IsNotEmpty()
        @IsString()
        @MinLength(2)
        name!: string;

        @IsOptional()
        @IsNumber()
        @Min(0)
        @Max(5)
        rating?: number;

        @IsNotEmpty()
        @IsNumber()
        @Min(1)
        price!: number;

        @IsNotEmpty()
        @IsString()
        description!: string;

        @IsNotEmpty()
        @IsMongoId()
        brandId!: Types.ObjectId;

        @IsNotEmpty()
        @IsMongoId()
        categoryId!: Types.ObjectId;
}