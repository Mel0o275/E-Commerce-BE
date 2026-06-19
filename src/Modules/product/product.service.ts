import { ConflictException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { productRepo } from 'src/common/repo/product.repo';
import { S3Service } from 'src/common/services/s3.service';
import type { IUser } from 'src/common/interface/user.interface';
import { PaginateProductResponse, ProductPaginationInput } from './entities/product.entity';
import { UserRepo } from 'src/common/repo/user.repo';

@Injectable()
export class ProductService {
  constructor(private readonly productRepo: productRepo,
    private readonly s3Service: S3Service,
    private readonly userRepo: UserRepo
  ) { }

  async create(
    dto: CreateProductDto,
    file: Express.Multer.File,
    user: IUser,
  ) {

    const key = await this.s3Service.uuploadFile({
      file,
      path: 'products',
    });

    const product = await this.productRepo.create({
      ...dto,
      image: key,
      createdBy: user._id,
      updatedBy: user._id,
    });

    return {
      message: 'Product created successfully',
      product,
    };
  }

async findAll(
  input?: ProductPaginationInput,
): Promise<PaginateProductResponse> {

  const page = input?.page ?? 1;
  const size = input?.size ?? 5;

  const products = await this.productRepo.find({
    isDeleted: false,
  });

  const start = (page - 1) * size;
  const end = start + size;

  const paginatedProducts = products.slice(start, end);

  const docs = await Promise.all(
    paginatedProducts.map(async (product: any) => {

      const createdByUser = product.createdBy
        ? await this.userRepo.findById(product.createdBy)
        : null;

      const plainProduct = product.toObject?.() ?? product;

      return {
        _id: plainProduct._id?.toString(),
        ...plainProduct,
        createdBy: createdByUser,
      };
    }),
  );

  return {
    docs,
    currentPage: page,
    pages: Math.ceil(products.length / size),
    size,
  };
}

  async findOne(id: string) {
    const product = await this.productRepo.findById(id);
    if (!product || (product as any).isDeleted) {
      throw new ConflictException('Product not found');
    }

    return {
      message: 'Product fetched successfully',
      product,
    };
  }

  async update(
    id: string,
    dto: UpdateProductDto,
    file: Express.Multer.File,
    user: IUser,
  ) {
    const exists = await this.productRepo.findOne({ _id: id });

    if (!exists) {
      throw new ConflictException('Product not found');
    }

    const updateData: any = {
      ...dto,
      updatedBy: user._id,
    };

    if (file?.originalname) {
      if ((exists as any).image) {
        await this.s3Service.deleteFile({
          Key: (exists as any).image,
        });
      }

      const key = await this.s3Service.uuploadFile({
        file,
        path: 'products',
      });

      updateData.image = key;
    }

    const product = await this.productRepo.updateOne(
      { _id: id },
      updateData,
    );

    return {
      message: 'Product updated successfully',
      product,
    };
  }

  async remove(id: string) {

    const product = await this.productRepo.findById(id);

    if (!product) {
      throw new ConflictException('Product not found');
    }

    await this.productRepo.updateOne(
      { _id: id },
      {
        isDeleted: true,
      },
    );

    return {
      message: 'Product deleted successfully',
    };
  }
}
