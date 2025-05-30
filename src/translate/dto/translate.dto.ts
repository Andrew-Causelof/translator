import { IsString, IsNotEmpty, IsIn, IsOptional , IsArray } from 'class-validator';

export class TranslateDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsIn(['en', 'cn', 'ar'])
  lang: string;

  @IsNotEmpty()
  @IsString()
  key?: string;

  @IsString()
  @IsNotEmpty()
  project: string;

  @IsOptional()
  @IsArray()
  @IsIn(['gpt', 'google', 'deepseek'], { each: true })
  services?: string[];

  @IsOptional()
  @IsString()
  context?: string;
}
