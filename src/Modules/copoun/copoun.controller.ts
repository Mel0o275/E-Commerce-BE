import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CopounService } from './copoun.service';
import { CreateCopounDto } from './dto/create-copoun.dto';
import { UpdateCopounDto } from './dto/update-copoun.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { RoleEnum } from 'src/common/enum/user.enum';
import { User } from 'src/common/decorators/user.decorator';
import type { IUser } from 'src/common/interface/user.interface';

@Auth([RoleEnum.ADMIN])
@Controller('copoun')
export class CopounController {
  constructor(private readonly copounService: CopounService) { }

  @Post()
  create(@Body() createCopounDto: CreateCopounDto, @User() user: IUser) {
    return this.copounService.create(createCopounDto, user);
  }

  @Get()
  findAll() {
    return this.copounService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCopounDto: UpdateCopounDto,
    @User() user: IUser,
  ) {
    return this.copounService.update(id, updateCopounDto, user);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @User() user: IUser,
  ) {
    return this.copounService.remove(id, user);
  }
}
