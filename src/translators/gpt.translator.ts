import { Injectable } from '@nestjs/common';
import { TranslatorProvider } from './interfaces/translator.interface';

@Injectable()
export class GptTranslator implements TranslatorProvider {
  name = 'gpt';

  async translate(text: string, lang: string): Promise<string> {
    return `[GPT:${lang}] ${text}`;
  }
}
