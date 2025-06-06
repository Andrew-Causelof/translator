import { IsArray, IsIn, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TranslateBatchItemDto } from './translate-batch-item.dto';

export class TranslateBatchDto {
  @IsString()
  project: string;

  @IsIn(['en', 'cn', 'ar'])
  lang: string;

  @IsOptional()
  @IsArray()
  @IsIn(['deepseek', 'gpt', 'google'], { each: true })
  services?: string[];

  @ValidateNested({ each: true })
  @Type(() => TranslateBatchItemDto)
  items: TranslateBatchItemDto[];
}
