import { Injectable } from '@nestjs/common';
import { GptTranslator } from './gpt.translator';
import { GoogleTranslator } from './google.translator';
import { TranslatorProvider } from './translator.interface';

@Injectable()
export class TranslatorManagerService {
  private translators: Record<string, TranslatorProvider>;

  constructor(
    private readonly gpt: GptTranslator,
    private readonly google: GoogleTranslator,
  ) {
    this.translators = {
      [this.gpt.name]: this.gpt,
      [this.google.name]: this.google,
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
