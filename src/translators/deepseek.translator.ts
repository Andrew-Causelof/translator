import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { TranslatorProvider } from './interfaces/translator.interface';

interface TranslateOptions {
  text: string;
  lang: string;
  context?: string;
}

interface DeepseekResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

@Injectable()
export class DeepseekTranslator implements TranslatorProvider {
  name = 'deepseek';

  private readonly apiKey = process.env.DEEPSEEK_API_KEY;
  private readonly endpoint = 'https://api.deepseek.com/v1/chat/completions';

  async translate(textOrOptions: string | TranslateOptions, lang?: string): Promise<string> {
    const options: TranslateOptions = typeof textOrOptions === 'string'
      ? { text: textOrOptions, lang: lang || 'en' }
      : textOrOptions;

    const systemPrompt = `You are a professional translator. Translate the following content into ${options.lang}. Preserve HTML tags if present.`;

    try {
      const response = await axios.post<DeepseekResponse>(
        this.endpoint,
        {
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: options.context ? `${options.context}\n\n${options.text}` : options.text },
          ],
          temperature: 0.2,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Deepseek translation error:', error?.response?.data || error.message);
      throw new Error('Failed to translate with Deepseek');
    }
  }
}
