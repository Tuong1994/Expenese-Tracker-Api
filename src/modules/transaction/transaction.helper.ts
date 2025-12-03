import { Injectable } from '@nestjs/common';
import { ELang } from 'src/common/enum/base';
import { TransactionCategory, TransactionWithPayload } from './transaction.type';
import { Prisma } from '@prisma/client';
import utils from 'src/utils';

@Injectable()
export class TransactionHelper {
  convertCollection(transactions: TransactionWithPayload[], langCode: ELang) {
    return transactions.map((transaction) => ({
      ...transaction,
      category:
        'category' in transaction
          ? utils.convertRecordsName<TransactionCategory>(transaction.category, langCode)
          : null,
    }));
  }

  convertCategory(category: TransactionCategory, langCode: ELang) {
    return utils.convertRecordsName<TransactionCategory>(category, langCode);
  }

  getSelectCategoryFields(): Prisma.CategorySelect {
    return { id: true, nameEn: true, nameVn: true, type: true };
  }
}
