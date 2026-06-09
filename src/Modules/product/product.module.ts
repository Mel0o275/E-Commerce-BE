import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product, productSchema } from 'src/DB/Product/product.model';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from 'src/DB/User/user.model';
import { S3Service } from 'src/common/services/s3.service';
import { productRepo } from 'src/common/repo/product.repo';
import { TokenSecurity } from 'src/common/security/token.security';
import { UserRepo } from 'src/common/repo/user.repo';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Product.name, schema: productSchema },
      { name: User.name, schema: userSchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    productRepo,
    S3Service,

    TokenSecurity,
    UserRepo,
    ConfigService,
  ],
})
export class ProductModule {}
