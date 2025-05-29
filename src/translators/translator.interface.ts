export interface TranslatorProvider {
    name: string;
    translate(text: string, lang: string): Promise<string>;
  }
  