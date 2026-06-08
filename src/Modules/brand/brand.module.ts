import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';

import { Brand, brandSchema } from 'src/DB/Brand/brand.model';
import { brandRepo } from 'src/common/repo/brand.repo';

import { TokenSecurity } from 'src/common/security/token.security';
import { UserRepo } from 'src/common/repo/user.repo';

import { S3Service } from 'src/common/services/s3.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User, userSchema } from 'src/DB/User/user.model';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Brand.name, schema: brandSchema },
      { name: User.name, schema: userSchema },
    ]),
  ],
  controllers: [BrandController],
  providers: [
    BrandService,
    brandRepo,
    S3Service,

    TokenSecurity,
    UserRepo,
    ConfigService,
  ],
})
export class BrandModule {}