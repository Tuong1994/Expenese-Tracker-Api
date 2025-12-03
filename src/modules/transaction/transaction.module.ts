import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionHelper } from './transaction.helper';
import { PrismaService } from '../prisma/prisma.service';
import { applyCheckIdMiddleware } from 'src/common/middleware/applyFn.middleware';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, TransactionHelper],
})
export class TransactionModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    applyCheckIdMiddleware({
      consumer,
      prisma: this.prisma,
      schema: 'transaction',
      routes: [
        {
          path: 'api/transaction/detail',
          method: RequestMethod.GET,
        },
        {
          path: 'api/transaction/update',
          method: RequestMethod.PUT,
        },
      ],
    });
  }
}
