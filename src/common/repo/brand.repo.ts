import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseRepo } from "./base.repo";
import { Injectable } from "@nestjs/common";
import { Brand } from "src/Modules/brand/entities/brand.entity";

@Injectable()
export class brandRepo extends BaseRepo<Brand> {
    constructor(
        @InjectModel(Brand.name)
        protected readonly brandModel: Model<Brand>
    ) {
        super(brandModel);
    }

    async find(filter = {}) {
        return this.model.find(filter);
    }
}