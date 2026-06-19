import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseRepo } from "./base.repo";
import { Injectable } from "@nestjs/common";
import { Cart } from "src/DB/Cart/cart.model";

@Injectable()
export class cartRepo extends BaseRepo<Cart> {
    constructor(
        @InjectModel(Cart.name)
        protected readonly cartModel: Model<Cart>
    ) {
        super(cartModel);
    }

    async find(filter = {}) {
        return this.model.find(filter);
    }
}