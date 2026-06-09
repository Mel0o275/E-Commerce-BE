import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseRepo } from "./base.repo";
import { Injectable } from "@nestjs/common";
import { Product } from "src/DB/Product/product.model";

@Injectable()
export class productRepo extends BaseRepo<Product> {
    constructor(
        @InjectModel(Product.name)
        protected readonly productModel: Model<Product>
    ) {
        super(productModel);
    }

    async find(filter = {}) {
        return this.model.find(filter);
    }
}