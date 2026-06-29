import {
    IsEnum,
    IsMongoId,
    IsOptional,
    IsString,
    Length,
    Matches,
} from 'class-validator';

import { CurrencyTypeEnum } from 'src/common/enum/order.enum';

export class CreateOrderDto {

    @IsString()
    @Length(2, 5000)
    address!: string;

    @IsOptional()
    @IsString()
    @Length(2, 5000)
    note?: string;

    @Matches(/^01[0125][0-9]{8}$/)
    phone!: string;

    @IsEnum(CurrencyTypeEnum)
    currency!: CurrencyTypeEnum;

    @IsString()
    @Length(2, 5000)
    @IsOptional()
    couponName?: string;
}