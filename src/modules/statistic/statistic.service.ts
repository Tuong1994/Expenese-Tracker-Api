import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ECashflow } from '../transaction/transaction.enum';
import { StatisticDto } from './statistic.dto';
import { StatisticHelper } from './statistic.helper';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class StatisticService {
  constructor(
    private prisma: PrismaService,
    private statisticHelper: StatisticHelper,
  ) {}

  private isNotDelete = { equals: false };

  async getSummary(statistic: StatisticDto) {
    const { startDate, endDate } = statistic;
    const start = this.statisticHelper.formatStartDateUTCTime(startDate);
    const end = this.statisticHelper.formatEndDateUTCTime(endDate);
    const transactions = await this.prisma.transaction.findMany({
      where: { AND: [{ isDelete: this.isNotDelete }, { createdAt: { gte: start, lte: end } }] },
      select: { amount: true },
    });
    const incomeTransactions = await this.prisma.transaction.findMany({
      where: {
        AND: [
          { isDelete: this.isNotDelete },
          { cashflow: { equals: ECashflow.INCOME } },
          { createdAt: { gte: start, lte: end } },
        ],
      },
      select: { amount: true },
    });
    const expenseTransactions = await this.prisma.transaction.findMany({
      where: {
        AND: [
          { isDelete: this.isNotDelete },
          { cashflow: { equals: ECashflow.EXPENSE } },
          { createdAt: { gte: start, lte: end } },
        ],
      },
      select: { amount: true },
    });
    const totalIncome = incomeTransactions.reduce((sum, income) => sum + income.amount, 0);
    const totalExpense = expenseTransactions.reduce((sum, expense) => sum + expense.amount, 0);
    const totalBalance = totalIncome - totalExpense;
    const totalTransactions = transactions.length;
    return { totalIncome, totalExpense, totalBalance, totalTransactions };
  }

  async getTotalExpenses(query: QueryDto, statistic: StatisticDto) {
    const { langCode } = query;
    const { startDate, endDate } = statistic;
    const start = this.statisticHelper.formatStartDateUTCTime(startDate);
    const end = this.statisticHelper.formatEndDateUTCTime(endDate);
    const expenseTransactions = await this.prisma.transaction.findMany({
      where: {
        AND: [
          { isDelete: this.isNotDelete },
          { cashflow: { equals: ECashflow.EXPENSE } },
          { createdAt: { gte: start, lte: end } },
        ],
      },
      include: { category: { select: { id: true, nameEn: true, nameVn: true, type: true } } },
    });
    const items = this.statisticHelper.convertCollection(expenseTransactions, langCode);
    const totalExpense = expenseTransactions.reduce((sum, expense) => sum + expense.amount, 0);
    const totalExpenses = items.map((item) => {
      const { id, amount, category } = item;
      return {
        id: id,
        amount: amount,
        percent: Number(((amount / totalExpense) * 100).toFixed(2)),
        category: {
          name: category.name,
          type: category.type,
        },
      };
    });
    return totalExpenses;
  }
}
