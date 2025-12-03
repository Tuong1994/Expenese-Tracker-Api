import { IsNotEmpty, IsNumber } from 'class-validator';

export class TransactionDto {
  @IsNotEmpty()
  cashflow: string;

  @IsNotEmpty()
  paymentMode: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  categoryId: string;
}
