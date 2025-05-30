export interface TranslatorProvider {
    name: string;
    translate(text: string, lang: string, context?: string): Promise<string>;
  }