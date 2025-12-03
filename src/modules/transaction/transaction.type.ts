import { Category, Prisma } from '@prisma/client';

export type TransactionCategory = Pick<Category, 'id' | 'nameEn' | 'nameVn' | 'type'>;

export type TransactionWithPayload = Prisma.TransactionGetPayload<{
  include: { category: { select: { id: true; nameEn: true; nameVn: true, type: true } } };
}>;
