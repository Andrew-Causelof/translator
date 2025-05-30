import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Translation } from './entities/translation.entity';
import { TranslateDto } from './dto/translate.dto';
import { ProjectService } from '../project/project.service';
import { TranslatorManagerService } from '../translators/translator.manager';
import { DeepseekTranslator } from '../translators/deepseek.translator';

@Injectable()
export class TranslateService {
  constructor(
    @InjectRepository(Translation)
    private translationRepo: Repository<Translation>,
    private readonly projectService: ProjectService,
    private readonly translatorManager: TranslatorManagerService, 
  ) {}

  async handleTranslation(dto: TranslateDto) {
    const { text, lang, project, key, services, context } = dto;
  
    const projectEntity = await this.projectService.findBySlug(project);
  
    if (!projectEntity || !projectEntity.active) {
      throw new NotFoundException(`Project "${project}" not found or inactive`);
    }
  
    if (!projectEntity.allowedLanguages.includes(lang)) {
      throw new BadRequestException(`Language "${lang}" not allowed for this project`);
    }
  
    const generatedKey = `${project}:${key}`;
  
    let translation = await this.translationRepo.findOne({
      where: { key: generatedKey, lang },
    });
  
    const fallbackOrder = services ?? projectEntity.fallbackOrder;
  
    if (!fallbackOrder || fallbackOrder.length === 0) {
      throw new BadRequestException('No translator services provided or configured for project');
    }
  
    const translatedText = await this.translatorManager.translateWithFallback(
      fallbackOrder,
      text,
      lang,
      context,
    );
  
    if (!translation) {
      translation = this.translationRepo.create({
        key: generatedKey,
        translated: translatedText,
        lang,
        original: text,
      });
    } else {
      translation.translated = translatedText;
      translation.original = text;
    }
  
    await this.translationRepo.save(translation);
    return translation;
  }
  
}
