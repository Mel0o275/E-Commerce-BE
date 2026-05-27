import { Injectable } from "@nestjs/common";
import { Model, UpdateQuery } from "mongoose";

@Injectable()
export abstract class BaseRepo<TDocument> {
    constructor(protected readonly model: Model<TDocument>) { }

    async create(data: Partial<TDocument>) {
        return this.model.create(data);
    }

    async createMany(data: Partial<TDocument>[]) {
        return this.model.insertMany(data);
    }

    async findOne(filter: any) {
        return this.model.findOne(filter);
    }

    async findById(id: string) {
        return this.model.findById(id);
    }

    async findAll(filter: any = {}) {
        return this.model.find(filter);
    }

    async exists(filter: any): Promise<boolean> {
        return !!(await this.model.exists(filter));
    }

    async count(filter: any = {}) {
        return this.model.countDocuments(filter);
    }

    async updateOne(filter: any, update: UpdateQuery<TDocument>) {
        return this.model.updateOne(filter, update);
    }

    async updateMany(filter: any, update: UpdateQuery<TDocument>) {
        return this.model.updateMany(filter, update);
    }

    async findOneAndUpdate(
        filter: any,
        update: UpdateQuery<TDocument>,
        options: any = { new: true }
    ) {
        return this.model.findOneAndUpdate(filter, update, options);
    }

    async findByIdAndUpdate(
        id: string,
        update: UpdateQuery<TDocument>,
        options: any = { new: true }
    ) {
        return this.model.findByIdAndUpdate(id, update, options);
    }

    async deleteOne(filter: any) {
        return this.model.deleteOne(filter);
    }

    async deleteMany(filter: any) {
        return this.model.deleteMany(filter);
    }

    async findOneAndDelete(filter: any) {
        return this.model.findOneAndDelete(filter);
    }

    async findByIdAndDelete(id: string) {
        return this.model.findByIdAndDelete(id);
    }
}