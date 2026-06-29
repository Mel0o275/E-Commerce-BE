import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './Modules/Authentication/authentication.module';
import { UserModule } from './Modules/User/user.module';
import { CategoryModule } from './Modules/category/category.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BrandModule } from './Modules/brand/brand.module';
import { ProductModule } from './Modules/product/product.module';
import { CartModule } from './Modules/cart/cart.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisModule } from './DB/redis.connection';
import { CopounModule } from './Modules/copoun/copoun.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { OrderModule } from './Modules/order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.dev', '.env.prod'],
      isGlobal: true,
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      graphiql: true,
    }),

    MongooseModule.forRoot(process.env.DB_URI as string),

    CacheModule.register({
      ttl: 1000,
      max: 100,
    }),

    AuthenticationModule,
    UserModule,
    CategoryModule,
    BrandModule,
    ProductModule,
    CartModule,
    RedisModule,
    CopounModule,
    OrderModule
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}
