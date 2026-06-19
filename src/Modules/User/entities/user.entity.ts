import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { GenderEnum, provider, RoleEnum } from "src/common/enum/user.enum";

registerEnumType(GenderEnum, {name: "GenderEnum"})
registerEnumType(provider, {name: "provider"})
registerEnumType(RoleEnum, {name: "RoleEnum"})

@ObjectType()
export class OneUserResponse {

    @Field(() => ID)
    _id!: string;

    @Field(() => String)
    firstName!: string;

    @Field(() => String)
    lastName!: string;

    @Field(() => String)
    email!: string;

    @Field(() => String,{ nullable: true })
    bio?: string;

    @Field(() => String,{ nullable: true })
    profileImage?: string;

    @Field(() => [String], { nullable: true })
    coverImages?: string[];

    @Field({ nullable: true })
    DOB?: Date;

    @Field({ nullable: true })
    confirmedAt?: Date;

    @Field(() => GenderEnum, { nullable: true })
    gender?: GenderEnum;

    @Field(() => RoleEnum, { nullable: true })
    role?: RoleEnum;

    @Field(() => provider)
    provider!: provider;

    @Field({ nullable: true })
    isVerified?: boolean;

    @Field({ nullable: true })
    changeCredentialsTime?: Date;

    @Field()
    createdAt!: Date;

    @Field()
    updatedAt?: Date;
}