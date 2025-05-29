import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Translation } from './entities/translation.entity';
import { TranslateDto } from './dto/translate.dto';
import { ProjectService } from '../project/project.service';
import { TranslatorManagerService } from '../translators/translator.manager';

@Injectable()
export class TranslateService {
  constructor(
    @InjectRepository(Translation)
    private translationRepo: Repository<Translation>,
    private readonly projectService: ProjectService,
    private readonly translatorManager: TranslatorManagerService, 
  ) {}

  async handleTranslation(dto: TranslateDto) {
    const { text, lang, project, key } = dto;

    const projectEntity = await this.projectService.findBySlug(project);

    if (!projectEntity || !projectEntity.active) {
      throw new NotFoundException(`Project "${project}" not found or inactive`);
    }

    if (!projectEntity.allowedLanguages.includes(lang)) {
      throw new BadRequestException(`Language "${lang}" not allowed for this project`);
    }

    // Генерация уникального ключа на основе текста и проекта (можно улучшить позже)
    const generatedKey = `${project}:${key}`;

    let translation = await this.translationRepo.findOne({
      where: { key: generatedKey, lang },
    });

    if (!translation) {
      const translated = await this.translatorManager.translateWithFallback(
        projectEntity.fallbackOrder,
        text,
        lang,
      );

      translation = this.translationRepo.create({
        key: generatedKey,
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
