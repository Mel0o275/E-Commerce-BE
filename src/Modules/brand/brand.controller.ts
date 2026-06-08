import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'src/common/decorators/user.decorator';
import type { IUser } from 'src/common/interface/user.interface';
import { Auth } from 'src/common/decorators/auth.decorator';
import { RoleEnum } from 'src/common/enum/user.enum';
import { cloudFileUpload } from 'src/common/utils/multer/multer';
import { storageApproachEnum } from 'src/common/enum/multer.enum';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) { }

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
    @Body() dto: CreateBrandDto,
    @UploadedFile() file: Express.Multer.File,
    @User() user: IUser,
  ) {
    return this.brandService.create(dto, file, user);
  }

  @Get()
  findAll() {
    return this.brandService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(id);
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
    @Body() CreateBrandDto: CreateBrandDto,
    @UploadedFile() file: Express.Multer.File,
    @User() user: IUser,
  ) {
    return this.brandService.update(id, CreateBrandDto, file, user);
  }

  @Auth([RoleEnum.ADMIN])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandService.remove(id);
  }
}
