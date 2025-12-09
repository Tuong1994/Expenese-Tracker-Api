import { Body, Controller, Post, HttpCode, HttpStatus, Query, Get } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatisticDto } from './statistic.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('api/statistic')
export class StatisticController {
  constructor(private statisticService: StatisticService) {}

  @Post('summary')
  @HttpCode(HttpStatus.OK)
  getSummary(@Body() statistic: StatisticDto) {
    return this.statisticService.getSummary(statistic);
  }

  @Post('totalExpenses')
  @HttpCode(HttpStatus.OK)
  getTotalExpenses(@Query() query: QueryDto, @Body() statistic: StatisticDto) {
    return this.statisticService.getTotalExpenses(query, statistic);
  }

  @Post('balances')
  @HttpCode(HttpStatus.OK)
  getBalances(@Body() statistic: StatisticDto) {
    return this.statisticService.getBalances(statistic);
  }

  @Get('recentTransactions')
  @HttpCode(HttpStatus.OK)
  getRecentTransactions(@Query() query: QueryDto) {
    return this.statisticService.getRecentTransactions(query);
  }
}
