import { IsString } from 'class-validator';

export class TranslateBatchItemDto {
  @IsString()
  key: string;

  @IsString()
  text: string;
}
