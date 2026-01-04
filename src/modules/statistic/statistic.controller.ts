import { Body, Controller, Post, HttpCode, HttpStatus, Query, Get, UseGuards, Req } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatisticDto } from './statistic.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { Request } from 'express';

@Controller('api/statistic')
export class StatisticController {
  constructor(private statisticService: StatisticService) {}

  @Post('summary')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getSummary(@Req() req: Request, @Body() statistic: StatisticDto) {
    return this.statisticService.getSummary(req, statistic);
  }

  @Post('totalExpenses')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getTotalExpenses(@Req() req: Request, @Query() query: QueryDto, @Body() statistic: StatisticDto) {
    return this.statisticService.getTotalExpenses(req, query, statistic);
  }

  @Post('balances')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getBalances(@Req() req: Request, @Body() statistic: StatisticDto) {
    return this.statisticService.getBalances(req, statistic);
  }

  @Get('recentTransactions')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getRecentTransactions(@Req() req: Request, @Query() query: QueryDto) {
    return this.statisticService.getRecentTransactions(req, query);
  }
}
