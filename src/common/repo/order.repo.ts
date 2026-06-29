import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseRepo } from "./base.repo";
import { Injectable } from "@nestjs/common";
import { Order } from "src/DB/Order/order.model";

@Injectable()
export class orderRepo extends BaseRepo<Order> {
    constructor(
        @InjectModel(Order.name)
        protected readonly orderModel: Model<Order>
    ) {
        super(orderModel);
    }

    async find(filter = {}) {
        return this.model.find(filter);
    }
}