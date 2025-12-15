import { ECashflow, EPaymentMode } from 'src/modules/transaction/transaction.enum';
import { ELang, ERole } from '../enum/base';
import { EGender } from 'src/modules/user/user.enum';

export class QueryDto {
  page?: string;
  limit?: string;
  keywords?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: number;

  ids?: string;
  userId?: string;
  categoryId?: string;
  transactionId?: string;
  imageId?: string;
  cityId?: string;
  districtId?: string;
  wardId?: string;
  cityCode?: number;
  districtCode?: number;

  staffOnly?: boolean;
  admin?: boolean;

  role?: ERole;
  gender?: EGender;
  cashflow?: ECashflow;
  paymentMode?: EPaymentMode;
  langCode?: ELang;
}
