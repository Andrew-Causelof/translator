import { Controller, Post, Body } from '@nestjs/common';
import { TranslateService } from './translate.service';
import { TranslateDto } from './dto/translate.dto';

@Controller('translate')
export class TranslateController {
  constructor(private readonly translateService: TranslateService) {}

  @Post()
  async translate(@Body() dto: TranslateDto) {
    return this.translateService.handleTranslation(dto);
  }
}
