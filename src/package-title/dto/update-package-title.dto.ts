import { PartialType } from '@nestjs/mapped-types';
import { CreatePackageTitleDto } from './create-package-title.dto';

export class UpdatePackageTitleDto extends PartialType(CreatePackageTitleDto) {}
