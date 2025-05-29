import { Module } from '@nestjs/common';
import { GptTranslator } from './gpt.translator';
import { GoogleTranslator } from './google.translator';
import { TranslatorManagerService } from './translator.manager';

@Module({
  providers: [GptTranslator, GoogleTranslator, TranslatorManagerService],
  exports: [TranslatorManagerService],
})
export class TranslatorModule {}
