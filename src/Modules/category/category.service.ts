import { ConflictException, Injectable } from '@nestjs/common';
import { IUser } from 'src/common/interface/user.interface';
import { S3Service } from 'src/common/services/s3.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { categoryRepo } from 'src/common/repo/brand.repo copy';
import { productRepo } from 'src/common/repo/product.repo';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepo: categoryRepo, private readonly s3Service: S3Service, private readonly productRepo: productRepo) { }
  async create(
    { name }: CreateCategoryDto,
    user: IUser,
  ) {

    const exists = await this.categoryRepo.findOne({ name });

    if (exists) {
      throw new ConflictException('Category already exists');
    }

    const category = await this.categoryRepo.create({
      name,
      createdBy: user._id,
      updatedBy: user._id,
    });

    return {
      message: 'Category created successfully',
      category,
    };
  }

  async findAll() {
    const categories = await this.categoryRepo.find(
      { isDeleted: false },
    );

    return {
      message: 'Categories fetched successfully',
      categories,
    };
  }

  async findOne(id: string) {
    const category = await this.categoryRepo.findById(id);
    if(!category || (category as any).isDeleted) {
      throw new ConflictException('Category not found');
    }

    return {
      message: 'Category fetched successfully',
      category,
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

    const category = await this.categoryRepo.findById(id);

    if (!category) {
      throw new ConflictException('Category not found');
    }

    const products = await this.productRepo.findAll({
      categoryId: id,
    });

    for (const product of products) {
      if ((product as any).image) {
        await this.s3Service.deleteFile({
          Key: (product as any).image,
        });
      }
    }

    await this.productRepo.updateMany(
      { categoryId: id },
      { isDeleted: true },
    );

    await this.categoryRepo.updateOne(
      { _id: id },
      { isDeleted: true },
    );

    return {
      message: 'Category and related products soft deleted successfully',
    };
  }
}