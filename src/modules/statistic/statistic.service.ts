import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ECashflow } from '../transaction/transaction.enum';
import { StatisticDto } from './statistic.dto';
import { StatisticHelper } from './statistic.helper';
import { QueryDto } from 'src/common/dto/query.dto';
import { AuthHelper } from '../auth/auth.helper';
import { Request } from 'express';
import utils from 'src/utils';

@Injectable()
export class StatisticService {
  constructor(
    private prisma: PrismaService,
    private statisticHelper: StatisticHelper,
    private authHelper: AuthHelper,
  ) {}

  private isNotDelete = { equals: false };

  async getSummary(req: Request, statistic: StatisticDto) {
    const { startDate, endDate } = statistic;
    const { start, end } = utils.formatDateUTCTime(startDate, endDate);
    const decode = this.authHelper.getJwtTokenDecode(req);
    const transactions = await this.prisma.transaction.findMany({
      where: { AND: [{ isDelete: this.isNotDelete }, { userId: decode.id }, { createdAt: { gte: start, lte: end } }] },
      select: { amount: true },
    });
    const incomeTransactions = await this.prisma.transaction.findMany({
      where: {
        AND: [
          { isDelete: this.isNotDelete },
          { userId: decode.id },
          { cashflow: { equals: ECashflow.INCOME } },
          { createdAt: { gte: start, lte: end } },
        ],
      },
      select: { amount: true },
      orderBy: [{ updatedAt: 'asc' }],
    });
    const expenseTransactions = await this.prisma.transaction.findMany({
      where: {
        AND: [
          { isDelete: this.isNotDelete },
          { userId: decode.id },
          { cashflow: { equals: ECashflow.EXPENSE } },
          { createdAt: { gte: start, lte: end } },
        ],
      },
      select: { amount: true },
      orderBy: [{ updatedAt: 'asc' }],
    });
    const totalIncome = incomeTransactions.reduce((sum, income) => sum + income.amount, 0);
    const totalExpense = expenseTransactions.reduce((sum, expense) => sum + expense.amount, 0);
    const totalBalance = totalIncome - totalExpense;
    const totalTransactions = transactions.length;
    return { totalIncome, totalExpense, totalBalance, totalTransactions };
  }

  async getTotalExpenses(req: Request, query: QueryDto, statistic: StatisticDto) {
    const { langCode } = query;
    const { startDate, endDate } = statistic;
    const { start, end } = utils.formatDateUTCTime(startDate, endDate);
    const decode = this.authHelper.getJwtTokenDecode(req);
    const expenseTransactions = await this.prisma.transaction.findMany({
      where: {
        AND: [
          { isDelete: this.isNotDelete },
          { userId: decode.id },
          { cashflow: { equals: ECashflow.EXPENSE } },
          { createdAt: { gte: start, lte: end } },
        ],
      },
      orderBy: [{ updatedAt: 'asc' }],
      include: { category: { select: { id: true, nameEn: true, nameVn: true, type: true } } },
    });
    const items = this.statisticHelper.convertCollection(expenseTransactions, langCode);
    const totalExpense = items.reduce((sum, expense) => sum + expense.amount, 0);
    const totalByCategory = items.reduce<Record<string, { name: string; amount: number }>>((acc, item) => {
      const type = item.category.type;
      acc[type] = { name: item.category.name, amount: (acc[type]?.amount || 0) + item.amount };
      return acc;
    }, {});
    const totalExpenses = Object.entries(totalByCategory).map(([type, value]) => ({
      type,
      name: value.name,
      amount: value.amount,
      percent: Number(((value.amount / totalExpense) * 100).toFixed(2)),
    }));
    return totalExpenses;
  }

  async getBalances(req: Request, statistic: StatisticDto) {
    const { startDate, endDate } = statistic;
    const { start, end } = utils.formatDateUTCTime(startDate, endDate);
    const decode = this.authHelper.getJwtTokenDecode(req);
    const incomeTransactions = await this.prisma.transaction.findMany({
      where: {
        AND: [
          { isDelete: this.isNotDelete },
          { userId: decode.id },
          { cashflow: { equals: ECashflow.INCOME } },
          { createdAt: { gte: start, lte: end } },
        ],
      },
      orderBy: [{ updatedAt: 'asc' }],
    });
    const expenseTransactions = await this.prisma.transaction.findMany({
      where: {
        AND: [
          { isDelete: this.isNotDelete },
          { userId: decode.id },
          { cashflow: { equals: ECashflow.EXPENSE } },
          { createdAt: { gte: start, lte: end } },
        ],
      },
      orderBy: [{ updatedAt: 'asc' }],
    });
    const incomes = this.statisticHelper.sumMonthlyTotals(incomeTransactions);
    const expenses = this.statisticHelper.sumMonthlyTotals(expenseTransactions);
    const icomesExpenses = incomes.map((income) => {
      const expense = expenses.find((exp) => exp.month === income.month);
      return { month: income.month, income: income.total, expense: expense.total };
    });
    const balances = incomes.map((income) => {
      const expense = expenses.find((exp) => exp.month === income.month);
      const amount = income.total - (expense.total ?? 0);
      return { month: income.month, amount };
    });
    return { balances, icomesExpenses };
  }

  async getRecentTransactions(req: Request, query: QueryDto) {
    const { langCode } = query;
    const decode = this.authHelper.getJwtTokenDecode(req);
    const transactions = await this.prisma.transaction.findMany({
      take: 5,
      where: { AND: [{ isDelete: this.isNotDelete }, { userId: decode.id }] },
      orderBy: [{ updatedAt: 'desc' }],
      include: { category: { select: { id: true, nameEn: true, nameVn: true, type: true } } },
    });
    const items = this.statisticHelper.convertCollection(transactions, langCode);
    return items;
  }
}
