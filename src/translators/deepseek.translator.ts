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

// @TODO Возможно переделать на подсчет токенов
const chooseModelByTextLength = function(text: string): 'deepseek-chat' | 'deepseek-reasoner' {
  const approxTokens = Math.ceil(text.length / 3.5); // оценка

  if (approxTokens > 8000) {
    return 'deepseek-reasoner';
  }
  return 'deepseek-chat';
}

@Injectable()
export class DeepseekTranslator implements TranslatorProvider {
  name = 'deepseek';

  private readonly apiKey = process.env.DEEPSEEK_API_KEY;
  private readonly endpoint = 'https://api.deepseek.com/v1/chat/completions';

  async translate(textOrOptions: string | TranslateOptions, lang?: string, context?: string): Promise<string> {
    const options: TranslateOptions = typeof textOrOptions === 'string'
    ? { text: textOrOptions, lang: lang || 'en', context }
    : textOrOptions;

    const systemPrompt = `You are a professional translator. Your task is to perform a precise and literal translation of the given text into ${lang}. Do not add explanations or paraphrasing. Preserve HTML tags and formatting exactly as provided.`;


    try {
      const response = await axios.post<DeepseekResponse>(
        this.endpoint,
        {
          model: chooseModelByTextLength(options.text),
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: options.context ? `${options.context}\n\n${options.text}` : options.text },
          ],
          temperature: 0.0,
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
