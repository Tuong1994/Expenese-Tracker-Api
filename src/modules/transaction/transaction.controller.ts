import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { QueryPaging } from 'src/common/decorator/query.decorator';
import { QueryDto } from 'src/common/dto/query.dto';
import { TransactionDto } from './transaction.dto';

@Controller('api/transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get('list')
  @HttpCode(HttpStatus.OK)
  getTransactions(@QueryPaging() query: QueryDto) {
    return this.transactionService.getTransactions(query);
  }

  @Get('detail')
  @HttpCode(HttpStatus.OK)
  getTransaction(@Query() query: QueryDto) {
    return this.transactionService.getTransaction(query);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  createTransaction(@Body() transaction: TransactionDto) {
    return this.transactionService.createTransaction(transaction);
  }

  @Put('update')
  @HttpCode(HttpStatus.OK)
  updateTransaction(@Query() query: QueryDto, @Body() transaction: TransactionDto) {
    return this.transactionService.updateTransaction(query, transaction);
  }

  @Delete('remove')
  @HttpCode(HttpStatus.OK)
  removeTransactions(@Query() query: QueryDto) {
    return this.transactionService.removeTransactions(query);
  }

  @Delete('removePermanent')
  @HttpCode(HttpStatus.OK)
  removeTransactionsPermanent(@Query() query: QueryDto) {
    return this.transactionService.removeTransactionsPermanent(query);
  }

  @Post('restore')
  @HttpCode(HttpStatus.OK)
  restoreTransactions() {
    return this.transactionService.restoreTransactions();
  }
}
