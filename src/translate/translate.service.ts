import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Translation } from './entities/translation.entity';
import { TranslateDto } from './dto/translate.dto';
import { ProjectService } from '../project/project.service';
import { TranslatorManagerService } from '../translators/translator.manager';
import { DeepseekTranslator } from '../translators/deepseek.translator';
import { TranslateBatchDto } from './dto/translate-batch.dto';

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
  
    const start = Date.now();

    const translatedText = await this.translatorManager.translateWithFallback(
      fallbackOrder,
      text,
      lang,
      context,
    );

    console.log('Deepseek latency handleTranslation:', Date.now() - start);
  
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

  async translateBatch(dto: TranslateBatchDto): Promise<Record<string, string>> {

    const { project, lang, services } = dto;

    const fallbackOrder = dto.services ?? ['deepseek'];
    const prompt = this.buildBatchPrompt(dto.items);

    const start = Date.now();

    const resultText = await this.translatorManager.translateWithFallback(
      fallbackOrder,
      prompt,
      lang,
    );

    console.log('Deepseek latency translateBatch:', Date.now() - start);
  
    const parsed = this.parseBatchResponse(resultText);

    for (const [key, translatedText] of Object.entries(parsed)) {
      await this.translationRepo.upsert({
        key: `${dto.project}:${key}`,
        lang: dto.lang,
        original: dto.items.find(item => item.key === key)?.text,
        translated: translatedText,
      }, ['key', 'lang']);
    }
    return parsed;
  }

  private buildBatchPrompt(items: { key: string; text: string }[]): string {
    return [
      'Translate only the values after the colon, keeping the keys. Response format: key: translation.',
      ...items.map(({ key, text }) => `${key}: ${text}`)
    ].join('\n');
  }
  
  private parseBatchResponse(response: string): Record<string, string> {
    const result: Record<string, string> = {};
  
    response.split('\n').forEach(line => {
      const [key, ...rest] = line.split(':');
      if (key && rest.length) {
        result[key.trim()] = rest.join(':').trim();
      }
    });
  
    return result;
  }

  
  
}
