import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { CACHE_MANAGER ,Cache} from '@nestjs/cache-manager';
import { S3Service } from './common/services/s3.service';

@Controller()
export class AppController {
  
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache,
  private readonly appService: AppService,) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
