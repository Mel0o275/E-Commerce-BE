import { ConflictException, Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { brandRepo } from 'src/common/repo/brand.repo';
import { HydratedDocument } from 'mongoose';
import { IUser } from 'src/common/interface/user.interface';
import { S3Service } from 'src/common/services/s3.service';

@Injectable()
export class BrandService {
  constructor(private readonly brandRepo: brandRepo, private readonly s3Service: S3Service) { }
  async create(
    { name }: CreateBrandDto,
    file: Express.Multer.File,
    user: IUser,
  ) {

    const exists = await this.brandRepo.findOne({ name });

    if (exists) {
      throw new ConflictException('Brand already exists');
    }

    const key = await this.s3Service.uuploadFile({
      file,
      path: 'brands',
    });

    const brand = await this.brandRepo.create({
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      image: key,
      createdBy: user._id,
      updatedBy: user._id,
    });

    return {
      message: 'Brand created successfully',
      brand,
    };
  }

  async findAll() {
    const brands = await this.brandRepo.find();

    return {
      message: 'Brands fetched successfully',
      brands,
    };
  }

  async findOne(id: string) {
    const brand = await this.brandRepo.findById(id);

    return {
      message: 'Brand fetched successfully',
      brand,
    };
  }

  async update(
    id: string,
    dto: CreateBrandDto,
    file: Express.Multer.File,
    user: IUser,
  ) {

    const exists = await this.brandRepo.findOne({ _id: id });

    if (!exists) {
      throw new ConflictException('Brand not found');
    }

    const updateData: any = {
      updatedBy: user._id,
    };

    if (dto.name) {
      updateData.name = dto.name;
      updateData.slug = (exists as any).name.toLowerCase().replace(/\s+/g, '-');
    }

    if (file?.originalname) {
      if ((exists as any).image) {
        await this.s3Service.deleteFile({ Key: (exists as any).image });
      }

      const key = await this.s3Service.uuploadFile({
        file,
        path: 'brands',
      });

      updateData.image = key;
    }

    const brand = await this.brandRepo.updateOne(
      { _id: id },
      updateData,
    );

    return {
      message: 'Brand updated successfully',
      brand,
    };
  }

  async remove(id: string) {

    const brand = await this.brandRepo.findById(id);

    if (!brand) {
      throw new ConflictException('Brand not found');
    }

    if ((brand as any).image) {
      await this.s3Service.deleteFile({
        Key: (brand as any).image,
      });
    }

    await this.brandRepo.deleteOne({
      _id: id,
    });

    return {
      message: 'Brand deleted successfully',
    };
  }
}
