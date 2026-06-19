import { PartialType } from '@nestjs/mapped-types';
import { CreateCartDto } from './create-cart.dto';
import { ArrayUnique, IsArray, IsMongoId, IsNumber } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateCartDto extends PartialType(CreateCartDto) {}

export class removeItemsFromCartDto {
    @IsMongoId({each: true})
    @ArrayUnique()
    @IsArray()
    productIds!: Types.ObjectId[]
}