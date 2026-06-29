import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from 'src/common/decorators/user.decorator';
import type { IUser } from 'src/common/interface/user.interface';
import { Auth } from 'src/common/decorators/auth.decorator';
import { RoleEnum } from 'src/common/enum/user.enum';
import type { Request } from 'express';


@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Auth([RoleEnum.ADMIN])
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @User() user: IUser) {
    return this.orderService.create(createOrderDto, user);
  }

  @Auth([RoleEnum.ADMIN])
  @Patch(':orderId/confirm')
  confirm(
    @Param('orderId') orderId: string,
    @User() user: IUser,
  ) {
    return this.orderService.confirm(orderId, user);
  }

  @Auth([RoleEnum.ADMIN])
  @Post(':orderId/checkout')
  CheckOut(
    @Param('orderId') orderId: string,
    @User() user: IUser,
  ) {
    return this.orderService.CheckOut(orderId, user);
  }

  @Post('webhook')
  webhook(@Req() req: Request) {
    return this.orderService.webHook(req);
  }

  @Patch(":orderId/refund")
  @Auth([RoleEnum.ADMIN])
  refund(
    @Param("orderId") orderId: string,
    @User() user: IUser,
  ) {
    return this.orderService.refund(orderId, user);
  }

}
