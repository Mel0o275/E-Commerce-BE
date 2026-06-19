import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from 'src/common/decorators/user.decorator';
import type { IUser } from 'src/common/interface/user.interface';
import { storageApproachEnum } from 'src/common/enum/multer.enum';
import { Auth } from 'src/common/decorators/auth.decorator';
import { RoleEnum } from 'src/common/enum/user.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { cloudFileUpload } from 'src/common/utils/multer/multer';
import { ProductPaginationInput } from './entities/product.entity';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Auth([RoleEnum.ADMIN])
  @Post()
  @UseInterceptors(
    FileInterceptor(
      'image',
      cloudFileUpload({
        storageApproach: storageApproachEnum.Memory,
        validation: ['image/jpeg', 'image/png'],
      }) as any,
    ),
  )
  create(
    @Body() dto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @User() user: IUser,
  ) {
    return this.productService.create(dto, file, user);
  }

  @Get()
  findAll(
    @Query() input: ProductPaginationInput,
  ) {
    return this.productService.findAll(input);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Auth([RoleEnum.ADMIN])
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor(
      'image',
      cloudFileUpload({
        storageApproach: storageApproachEnum.Memory,
        validation: ['image/jpeg', 'image/png'],
      }) as any,
    ),
  )
  update(
    @Param('id') id: string,
    @Body() CreateBrandDto: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @User() user: IUser,
  ) {
    return this.productService.update(id, CreateBrandDto, file, user);
  }

  @Auth([RoleEnum.ADMIN])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
