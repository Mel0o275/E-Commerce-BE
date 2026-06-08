import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './Modules/Authentication/authentication.module';
import { UserModule } from './Modules/User/user.module';
import { CategoryModule } from './Modules/category/category.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BrandModule } from './Modules/brand/brand.module';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: ['.env.dev', '.env.prod'],
    isGlobal: true
  }),
  MongooseModule.forRoot(process.env.DB_URI as string)
  ,AuthenticationModule, UserModule, CategoryModule, BrandModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
