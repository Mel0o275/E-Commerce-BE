import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { removeItemsFromCartDto, UpdateCartDto } from './dto/update-cart.dto';
import { User } from 'src/common/decorators/user.decorator';
import type { IUser } from 'src/common/interface/user.interface';
import { AuthenticationGuard } from 'src/common/guards/authentication/authentication.guard';
import { CustomCacheInterceptor } from 'src/common/interceptors/cache.Interceptor';

@UseGuards(AuthenticationGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Post()
  create(@Body() createCartDto: CreateCartDto, @User() user: IUser) {
    return this.cartService.create(createCartDto, user);
  }

  @Patch()
  async removeItemsFromCart(
    @Body() removeItemsFromCartDto: removeItemsFromCartDto, @User() user: IUser
  ) {
    return this.cartService.removeItemsFromCart(removeItemsFromCartDto, user);
  }

  @Delete()
  deleteCart(@User() user: IUser) {
    return this.cartService.deleteCart(user);
  }

  @UseInterceptors(CustomCacheInterceptor)
  @UseGuards(AuthenticationGuard)
  @Get()
  getCart(@User() user: IUser) {
    return this.cartService.getCart(user);
  }
}
