import { Injectable } from '@nestjs/common';
import { GptTranslator } from './gpt.translator';
import { GoogleTranslator } from './google.translator';
import { TranslatorProvider } from './interfaces/translator.interface';
import { DeepseekTranslator } from '../translators/deepseek.translator';


@Injectable()
export class TranslatorManagerService {
  private translators: Record<string, TranslatorProvider>;

  constructor(
    private readonly gpt: GptTranslator,
    private readonly google: GoogleTranslator,
    private readonly deepseek: DeepseekTranslator,
  ) {
    this.translators = {
      [this.gpt.name]: this.gpt,
      [this.google.name]: this.google,
      [this.deepseek.name]: this.deepseek
    };
  }

  async translateWithFallback(
    services: string[],
    text: string,
    lang: string,
  ): Promise<string> {
    for (const service of services) {
      const provider = this.translators[service];
      if (!provider) continue;

      try {
        return await provider.translate(text, lang);
      } catch (error) {
        console.warn(`⚠️ ${service} failed: ${error.message}`);
      }
    }

    throw new Error('No available translation providers succeeded');
  }
}
