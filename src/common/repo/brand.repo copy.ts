import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseRepo } from "./base.repo";
import { Injectable } from "@nestjs/common";
import { Category } from "src/DB/Category/category.model";

@Injectable()
export class categoryRepo extends BaseRepo<Category> {
    constructor(
        @InjectModel(Category.name)
        protected readonly categoryModel: Model<Category>
    ) {
        super(categoryModel);
    }

    async find(filter = {}) {
        return this.model.find(filter);
    }
}