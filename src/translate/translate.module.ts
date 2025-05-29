import { Module } from '@nestjs/common';
import { TranslateController } from './translate.controller';
import { TranslateService } from './translate.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Translation } from './entities/translation.entity';
import { ProjectModule } from '../project/project.module';
import { TranslatorModule } from '../translators/translator.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Translation]),
    ProjectModule,
    TranslatorModule,
  ],
  providers: [TranslateService],
  controllers: [TranslateController],
})
export class TranslateModule {}
