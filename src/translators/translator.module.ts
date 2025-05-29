import { Module } from '@nestjs/common';
import { GptTranslator } from './gpt.translator';
import { GoogleTranslator } from './google.translator';
import { TranslatorManagerService } from './translator.manager';
import { DeepseekTranslator } from './deepseek.translator';

@Module({
  providers: [GptTranslator, GoogleTranslator, DeepseekTranslator, TranslatorManagerService],
  exports: [TranslatorManagerService],
})
export class TranslatorModule {}
