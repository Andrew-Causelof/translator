import { Injectable } from '@nestjs/common';
import { TranslateDto } from './dto/translate.dto';

@Injectable()
export class TranslateService {
  async handleTranslation(dto: TranslateDto) {
    // Пока просто заглушка
    return {
      translated: `[${dto.lang.toUpperCase()}] ${dto.text}`,
      key: dto.key || 'generated_key',
    };
  }
}
