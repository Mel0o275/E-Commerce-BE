import { Transform, Type } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { IsBefore } from "src/common/decorators/isStartGreaterThanEnd.decorator";
import { CopounType, CopounUsage } from "src/common/enum/copoun.enum";
import { ICopoun } from "src/common/interface/copoun.interface";

export class CreateCopounDto implements Partial<ICopoun> {

    @IsOptional()
    @IsNumber()
    amount?: number;

    @IsEnum(CopounType)
    copounType!: CopounType;

    @IsEnum(CopounUsage)
    copounUsage!: CopounUsage;

    @Transform(({ value }) => new Date(value))
    @IsDate()
    endDate!: Date;

    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsOptional()
    @IsNumber()
    percentage?: number;

    @Transform(({ value }) => new Date(value))
    @IsDate()
    @IsBefore('endDate', {
        message: 'startDate must be before endDate',
    })
    startDate!: Date;
}
