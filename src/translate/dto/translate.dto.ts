import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';

export class TranslateDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsIn(['en', 'fr', 'ar'])
  lang: string;

  @IsOptional()
  @IsString()
  key?: string;

  @IsOptional()
  context?: {
    html?: string;
    uri?: string;
    project?: string;
  };
}
