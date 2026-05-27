import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseRepo } from "./base.repo";
import { User } from "src/DB/User/user.model";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserRepo extends BaseRepo<User> {
    constructor(
        @InjectModel(User.name)
        protected readonly userModel: Model<User>
    ) {
        super(userModel);
    }
}