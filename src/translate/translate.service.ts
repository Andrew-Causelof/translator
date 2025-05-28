import { Injectable } from '@nestjs/common';
import { TranslateDto } from './dto/translate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Translation } from './entities/translation.entity';

@Injectable()
export class TranslateService {
  constructor(
    @InjectRepository(Translation)
    private translationRepo: Repository<Translation>,
  ) {}

  async handleTranslation(dto: TranslateDto) {
    const { text, lang, key = 'autogen' } = dto;

    // Ищем в базе
    let translation = await this.translationRepo.findOne({ where: { key, lang } });

    if (!translation) {
      // эмулируем перевод
      const translated = `[${lang.toUpperCase()}] ${text}`;

      translation = this.translationRepo.create({
        key,
        lang,
        original: text,
        translated,
      });

      await this.translationRepo.save(translation);
    }

    return {
      translated: translation.translated,
      key: translation.key,
    };
  }
}