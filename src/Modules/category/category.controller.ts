import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { RoleEnum } from 'src/common/enum/user.enum';
import type { IUser } from 'src/common/interface/user.interface';
import { User } from 'src/common/decorators/user.decorator';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Auth([RoleEnum.ADMIN])
  @Post()
  create(
    @Body() dto: CreateCategoryDto,
    @User() user: IUser,
  ) {
    return this.categoryService.create(dto, user);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Auth([RoleEnum.ADMIN])
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() CreateBrandDto: CreateCategoryDto,
    @User() user: IUser,
  ) {
    return this.categoryService.update(id, CreateBrandDto, user);
  }

  @Auth([RoleEnum.ADMIN])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
