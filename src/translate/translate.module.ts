import { Module } from '@nestjs/common';
import { TranslateController } from './translate.controller';
import { TranslateService } from './translate.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Translation } from './entities/translation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Translation])],

  controllers: [TranslateController],
  providers: [TranslateService]
})
export class TranslateModule {}
