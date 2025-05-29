import { TranslatorProvider } from './translator.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleTranslator implements TranslatorProvider {
  name = 'google';

  async translate(text: string, lang: string): Promise<string> {
    return `[Google:${lang}] ${text}`;
  }
}
