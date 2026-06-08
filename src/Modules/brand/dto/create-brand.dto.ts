import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateBrandDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    name!: string;
}
