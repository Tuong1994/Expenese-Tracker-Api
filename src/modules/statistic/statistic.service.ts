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
      orderBy: [{ updatedAt: 'asc' }],
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
      orderBy: [{ updatedAt: 'asc' }],
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
      orderBy: [{ updatedAt: 'asc' }],
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

  async getBalances(statistic: StatisticDto) {
    const { startDate, endDate } = statistic;
    const start = this.statisticHelper.formatStartDateUTCTime(startDate);
    const end = this.statisticHelper.formatEndDateUTCTime(endDate);
    const incomeTransactions = await this.prisma.transaction.findMany({
      where: {
        AND: [
          { isDelete: this.isNotDelete },
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

  async getRecentTransactions(query: QueryDto) {
    const { langCode } = query;
    const transactions = await this.prisma.transaction.findMany({
      take: 5,
      where: { isDelete: this.isNotDelete },
      orderBy: [{ updatedAt: 'desc' }],
      include: { category: { select: { id: true, nameEn: true, nameVn: true, type: true } } },
    });
    const items = this.statisticHelper.convertCollection(transactions, langCode);
    return items;
  }
}
