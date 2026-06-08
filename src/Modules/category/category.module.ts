import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, categorySchema } from 'src/DB/Category/category.model';
import { User, userSchema } from 'src/DB/User/user.model';
import { categoryRepo } from 'src/common/repo/brand.repo copy';
import { S3Service } from 'src/common/services/s3.service';
import { TokenSecurity } from 'src/common/security/token.security';
import { UserRepo } from 'src/common/repo/user.repo';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Category.name, schema: categorySchema },
      { name: User.name, schema: userSchema },
    ]),
  ],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    categoryRepo,
    S3Service,

    TokenSecurity,
    UserRepo,
    ConfigService,
  ],
})
export class CategoryModule {}
