import { Injectable } from '@nestjs/common';
import { TransactionCategory, TransactionWithPayload } from '../transaction/transaction.type';
import { ELang } from 'src/common/enum/base';
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

  formatStartDateUTCTime(date: Date | string) {
    return new Date(date);
  }

  formatEndDateUTCTime(date: Date | string) {
    return new Date(new Date(date).setUTCHours(23, 59, 59, 999));
  }
}
