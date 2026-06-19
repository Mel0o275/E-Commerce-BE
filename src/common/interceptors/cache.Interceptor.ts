import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RedisService } from '../services/redis.service';
import { Reflector } from '@nestjs/core';
import { ttlName } from '../decorators/ttl.decorator';

@Injectable()
export class CustomCacheInterceptor implements NestInterceptor {
    constructor(
        private readonly redis: RedisService,
        private readonly reflector: Reflector,
    ) { }

    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const url = request.url;

        const cacheKey = `cache:${url}`;

        const data = await this.redis.get(cacheKey);

        if (data) {
            return of(data);
        }

        return next.handle().pipe(
            tap(async (value) => {
                const ttl = this.reflector.getAllAndOverride<number>(ttlName, [context.getHandler(), context.getClass()])??10;
                await this.redis.set(cacheKey, value, ttl);
            }),
        );
    }
}