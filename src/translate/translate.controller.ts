import { Controller, Post, Body } from '@nestjs/common';
import { TranslateDto } from './dto/translate.dto';
import { TranslateService } from './translate.service';

@Controller('translate')
export class TranslateController {
  constructor(private readonly translateService: TranslateService) {}

  @Post()
  async translate(@Body() dto: TranslateDto) {
    return this.translateService.handleTranslation(dto);
  }
}
