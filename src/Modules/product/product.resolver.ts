import { Args, Query, Resolver } from "@nestjs/graphql";
import { PaginateProductResponse, ProductPaginationInput } from "./entities/product.entity";
import { ProductService } from "./product.service";
import { UseInterceptors } from "@nestjs/common";
import { CustomCacheInterceptor } from "src/common/interceptors/cache.Interceptor";

@Resolver()
export class productResolver {

    constructor(
        private readonly productService: ProductService
    ) { }

    @Query(() => PaginateProductResponse)
    async allProducts(
        @Args('input', { nullable: true })
        input?: ProductPaginationInput,
    ): Promise<PaginateProductResponse> {
        return this.productService.findAll(input);
    }
}