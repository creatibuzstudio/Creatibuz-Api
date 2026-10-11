import { PartialType } from '@nestjs/mapped-types';
import { CreateCasestudyDto } from './create-casestudy.dto';

export class UpdateCasestudyDto extends PartialType(CreateCasestudyDto) {}
