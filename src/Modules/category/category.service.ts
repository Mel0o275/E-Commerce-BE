import { ConflictException, Injectable } from '@nestjs/common';
import { IUser } from 'src/common/interface/user.interface';
import { S3Service } from 'src/common/services/s3.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { categoryRepo } from 'src/common/repo/brand.repo copy';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepo: categoryRepo, private readonly s3Service: S3Service) { }
  async create(
    { name }: CreateCategoryDto,
    user: IUser,
  ) {

    const exists = await this.categoryRepo.findOne({ name });

    if (exists) {
      throw new ConflictException('Brand already exists');
    }

    const brand = await this.categoryRepo.create({
      name,
      createdBy: user._id,
      updatedBy: user._id,
    });

    return {
      message: 'Brand created successfully',
      brand,
    };
  }

  async findAll() {
    const brands = await this.categoryRepo.find();

    return {
      message: 'Brands fetched successfully',
      brands,
    };
  }

  async findOne(id: string) {
    const brand = await this.categoryRepo.findById(id);

    return {
      message: 'Brand fetched successfully',
      brand,
    };
  }

  async update(
    id: string,
    dto: CreateCategoryDto,
    user: IUser,
  ) {

    const exists = await this.categoryRepo.findOne({ _id: id });

    if (!exists) {
      throw new ConflictException('Category not found');
    }

    if (dto.name) {

      const duplicate = await this.categoryRepo.findOne({
        name: dto.name,
      });

      if (duplicate && duplicate._id.toString() !== id) {
        throw new ConflictException('Category already exists');
      }

    }

    const updateData: any = {
      updatedBy: user._id,
    };

    if (dto.name) {
      updateData.name = dto.name;
    }

    const category = await this.categoryRepo.updateOne(
      { _id: id },
      updateData,
    );

    return {
      message: 'Category updated successfully',
      category,
    };
  }

  async remove(id: string) {
    const brand = await this.categoryRepo.deleteOne({ _id: id });

    return {
      message: 'Brand deleted successfully',
      brand,
    };
  }
}