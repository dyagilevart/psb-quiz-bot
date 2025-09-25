/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ChartService } from './chart.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ChartService],
  exports: [ChartService],
})
export class ChartModule {}
