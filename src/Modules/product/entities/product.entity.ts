import { Field, ID, Int, Float, ObjectType, InputType } from "@nestjs/graphql";
import { Types } from "mongoose";
import { IProduct } from "src/common/interface/product.interface";
import { OneUserResponse } from "src/Modules/User/entities/user.entity";

@ObjectType()
export class OneProductResponse {

    @Field(() => ID)
    _id!: string;

    @Field(() => ID)
    brandId!: Types.ObjectId;

    @Field(() => ID)
    categoryId!: Types.ObjectId;

    @Field(() => OneUserResponse, { nullable: true })
    createdBy?: OneUserResponse | null;

    @Field(() => String, { nullable: true })
    updatedBy?: string;

    @Field()
    description!: string;

    @Field()
    name!: string;

    @Field()
    image!: string;

    @Field(() => Float)
    price!: number;

    @Field(() => Float, { nullable: true })
    rating?: number;

    @Field({ nullable: true })
    updatedAt?: Date;

    @Field()
    createdAt!: Date;

}

@ObjectType()
export class PaginateProductResponse {

    @Field(() => [OneProductResponse])
    docs!: OneProductResponse[];

    @Field(() => Int, { nullable: true })
    currentPage?: number;

    @Field(() => Int, { nullable: true })
    pages?: number;

    @Field(() => Int, { nullable: true })
    size?: number;
}

@InputType()
export class ProductPaginationInput {

    @Field(() => Int, { defaultValue: 1 })
    page?: number;

    @Field(() => Int, { defaultValue: 10 })
    size?: number;
}