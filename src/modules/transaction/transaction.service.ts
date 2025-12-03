import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { TransactionWithPayload } from './transaction.type';
import { TransactionHelper } from './transaction.helper';
import { TransactionDto } from './transaction.dto';
import responseMessage from 'src/common/message';
import utils from 'src/utils';

const { CREATE_ERROR, UPDATE_SUCCESS, REMOVE_SUCCESS, NOT_FOUND, NO_DATA_RESTORE, RESTORE_SUCCESS } = responseMessage;

@Injectable()
export class TransactionService {
  constructor(
    private prisma: PrismaService,
    private transactionHelper: TransactionHelper,
  ) {}

  async getTransactions(query: QueryDto) {
    const { page, limit, keywords, sortBy, langCode } = query;
    let collection: Paging<TransactionWithPayload> = utils.defaultCollection();
    const transactions = await this.prisma.transaction.findMany({
      where: { isDelete: { equals: false } },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
      include: { category: { select: { ...this.transactionHelper.getSelectCategoryFields() } } },
    });
    if (keywords) {
      const filterTransactions = transactions.filter((transaction) => {
        utils.filterByKeywords(transaction.description, keywords) ||
          utils.filterByKeywords(String(transaction.amount), keywords);
      });
      collection = utils.paging<TransactionWithPayload>(filterTransactions, page, limit);
    } else collection = utils.paging<TransactionWithPayload>(transactions, page, limit);
    const items = this.transactionHelper.convertCollection(collection.items, langCode);
    return { ...collection, items };
  }

  async getTransaction(query: QueryDto) {
    const { transactionId, langCode } = query;
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { category: { select: { ...this.transactionHelper.getSelectCategoryFields() } } },
    });
    const convertCategory = this.transactionHelper.convertCategory(transaction.category, langCode);
    return { ...transaction, category: convertCategory };
  }

  async createTransaction(transaction: TransactionDto) {
    const { cashflow, paymentMode, amount, description, userId, categoryId } = transaction;
    const newTransaction = await this.prisma.transaction.create({
      data: { cashflow, paymentMode, amount, description, userId, categoryId, isDelete: false },
    });
    if (!newTransaction) throw new HttpException(CREATE_ERROR, HttpStatus.BAD_GATEWAY);
    return newTransaction;
  }

  async updateTransaction(query: QueryDto, transaction: TransactionDto) {
    const { transactionId } = query;
    const { cashflow, paymentMode, amount, description, userId, categoryId } = transaction;
    await this.prisma.transaction.update({
      where: { id: transactionId },
      data: { cashflow, paymentMode, amount, description, userId, categoryId },
    });
    throw new HttpException(UPDATE_SUCCESS, HttpStatus.OK);
  }

  async removeTransactions(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const transactions = await this.prisma.transaction.findMany({ where: { id: { in: listIds } } });
    if (transactions && !transactions.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.transaction.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
    throw new HttpException(REMOVE_SUCCESS, HttpStatus.OK);
  }

  async removeTransactionsPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const transactions = await this.prisma.transaction.findMany({ where: { id: { in: listIds } } });
    if (transactions && !transactions.length) throw new HttpException(NOT_FOUND, HttpStatus.OK);
    await this.prisma.transaction.deleteMany({ where: { id: { in: listIds } } });
    throw new HttpException(REMOVE_SUCCESS, HttpStatus.OK);
  }

  async restoreTransactions() {
    const transactions = await this.prisma.transaction.findMany({ where: { isDelete: { equals: true } } });
    if (transactions && !transactions.length) throw new HttpException(NO_DATA_RESTORE, HttpStatus.OK);
    await Promise.all(
      transactions.map(
        async (transaction) =>
          await this.prisma.transaction.update({ where: { id: transaction.id }, data: { isDelete: false } }),
      ),
    );
    throw new HttpException(RESTORE_SUCCESS, HttpStatus.OK);
  }
}
