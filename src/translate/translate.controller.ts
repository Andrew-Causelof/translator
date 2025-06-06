import { Controller, Post, Body } from '@nestjs/common';
import { TranslateService } from './translate.service';
import { TranslateDto } from './dto/translate.dto';
import { TranslateBatchDto } from './dto/translate-batch.dto';


@Controller('translate')
export class TranslateController {
  constructor(private readonly translateService: TranslateService) {}

  @Post('batch')
  async translateBatch(@Body() dto: TranslateBatchDto) {
    return this.translateService.translateBatch(dto);
  }
  
  @Post()
  async translate(@Body() dto: TranslateDto) {
    return this.translateService.handleTranslation(dto);
  }
}
