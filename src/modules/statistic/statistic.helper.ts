import { Injectable } from '@nestjs/common';
import { TransactionCategory, TransactionWithPayload } from '../transaction/transaction.type';
import { ELang } from 'src/common/enum/base';
import { Transaction } from '@prisma/client';
import utils from 'src/utils';

@Injectable()
export class StatisticHelper {
  convertCollection(transactions: TransactionWithPayload[], langCode: ELang) {
    return transactions.map((transaction) => ({
      ...transaction,
      category:
        'category' in transaction
          ? utils.convertRecordsName<TransactionCategory>(transaction.category, langCode)
          : null,
    }));
  }

  sumMonthlyTotals(transactions: Transaction[]) {
    const monthlyTotals: Record<string, number> = transactions.reduce((total, transaction) => {
      const month = String(transaction.createdAt).slice(4, 7);
      if (!total[month]) total[month] = 0;
      total[month] += transaction.amount;
      return total;
    }, {});
    return Object.entries(monthlyTotals).map(([month, total]) => ({
      month,
      total,
    }));
  }

  formatStartDateUTCTime(date: Date | string) {
    return new Date(date);
  }

  formatEndDateUTCTime(date: Date | string) {
    return new Date(new Date(date).setUTCHours(23, 59, 59, 999));
  }
}
