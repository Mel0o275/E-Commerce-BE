import { Global, Module } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisService } from 'src/common/services/redis.service';

@Global()
@Module({
    providers: [
        {
            provide: 'Redis_Client',
            useFactory: async () => {
                const client = createClient({
                    url: process.env.REDIS_URL,
                });

                await client.connect();
                return client;
            },
        },
        RedisService,
    ],
    exports: ['Redis_Client', RedisService],
})
export class RedisModule { }