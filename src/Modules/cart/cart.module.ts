import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart, CartSchema } from 'src/DB/Cart/cart.model';
import { User, userSchema } from 'src/DB/User/user.model';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, productSchema } from 'src/DB/Product/product.model';
import { cartRepo } from 'src/common/repo/cart.repo';
import { productRepo } from 'src/common/repo/product.repo';
import { S3Service } from 'src/common/services/s3.service';
import { ProductService } from '../product/product.service';
import { TokenSecurity } from 'src/common/security/token.security';
import { UserRepo } from 'src/common/repo/user.repo';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: User.name, schema: userSchema },
      { name: Product.name, schema: productSchema },
    ]),
  ],
  controllers: [CartController],
  providers: [
    CartService,
    cartRepo,
    productRepo,
    S3Service,
    ProductService,
    TokenSecurity,
    UserRepo,
    ConfigService,
  ],
})
export class CartModule {}
