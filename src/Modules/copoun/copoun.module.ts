import { Module } from '@nestjs/common';
import { CopounService } from './copoun.service';
import { CopounController } from './copoun.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Copoun, Copounchema } from 'src/DB/Copoun/copoun.model';
import { User, userSchema } from 'src/DB/User/user.model';
import { TokenSecurity } from 'src/common/security/token.security';
import { UserRepo } from 'src/common/repo/user.repo';
import { copounRepo } from 'src/common/repo/copoun.repo';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Copoun.name, schema: Copounchema },
      { name: User.name, schema: userSchema },      
    ]),
  ],
  controllers: [CopounController],
  providers: [
    CopounService,
    TokenSecurity,
    copounRepo,
    UserRepo,
    ConfigService,
  ],
})
export class CopounModule {}
