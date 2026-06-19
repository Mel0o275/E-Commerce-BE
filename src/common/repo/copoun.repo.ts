import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseRepo } from "./base.repo";
import { Injectable } from "@nestjs/common";
import { Copoun } from "src/DB/Copoun/copoun.model";

@Injectable()
export class copounRepo extends BaseRepo<Copoun> {
    constructor(
        @InjectModel(Copoun.name)
        protected readonly copounModel: Model<Copoun>
    ) {
        super(copounModel);
    }

    async find(filter = {}) {
        return this.model.find(filter);
    }
}