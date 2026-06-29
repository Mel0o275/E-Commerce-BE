import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { productRepo } from 'src/common/repo/product.repo';
import { TokenSecurity } from 'src/common/security/token.security';
import { cartRepo } from 'src/common/repo/cart.repo';
import { orderRepo } from 'src/common/repo/order.repo';
import { copounRepo } from 'src/common/repo/copoun.repo';
import { ConfigService } from '@nestjs/config';
import { productResolver } from '../product/product.resolver';
import { OrderModel } from 'src/DB/Order/order.model';
import { ProductModel } from 'src/DB/Product/product.model';
import { CartModel } from 'src/DB/Cart/cart.model';
import { CopounModel } from 'src/DB/Copoun/copoun.model';
import { UserRepo } from 'src/common/repo/user.repo';
import { UserModel } from 'src/DB/User/user.model';
import { ProductService } from '../product/product.service';
import { S3Service } from 'src/common/services/s3.service';
import { PaymentService } from 'src/common/services/stripe.service';

@Module({
  imports:[OrderModel, ProductModel, CartModel, CopounModel, UserModel],
  controllers: [OrderController],
    providers: [
      OrderService,
      productRepo,
      ProductService,
      S3Service,
      TokenSecurity,
      cartRepo,
      orderRepo,
      copounRepo,
      UserRepo,
      PaymentService,
      ConfigService,
      productResolver,
    ],
})
export class OrderModule {}
