import { PartialType } from '@nestjs/mapped-types';
import { CreateCopounDto } from './create-copoun.dto';

export class UpdateCopounDto extends PartialType(CreateCopounDto) {}
