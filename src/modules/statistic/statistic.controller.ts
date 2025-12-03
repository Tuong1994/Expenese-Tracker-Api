import { Body, Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatisticDto } from './statistic.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('api/statistic')
export class StatisticController {
  constructor(private statisticService: StatisticService) {}

  @Get('summary')
  @HttpCode(HttpStatus.OK)
  getSummary(@Body() statistic: StatisticDto) {
    return this.statisticService.getSummary(statistic);
  }

  @Get('totalExpenses')
  @HttpCode(HttpStatus.OK)
  getTotalExpenses(@Query() query: QueryDto, @Body() statistic: StatisticDto) {
    return this.statisticService.getTotalExpenses(query, statistic);
  }
}
