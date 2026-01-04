import { Module } from '@nestjs/common';
import { StatisticController } from './statistic.controller';
import { StatisticService } from './statistic.service';
import { StatisticHelper } from './statistic.helper';
import { AuthHelper } from '../auth/auth.helper';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [StatisticController],
  providers: [StatisticService, StatisticHelper, AuthHelper, JwtService],
})
export class StatisticModule {}
