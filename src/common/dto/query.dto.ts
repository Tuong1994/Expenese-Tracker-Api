import { ELang, ERole } from '../enum/base';
import { EGender } from 'src/modules/user/user.enum';

export class QueryDto {
  page?: string;
  limit?: string;
  keywords?: string;
  sortBy?: number;

  ids?: string;
  userId?: string;
  categoryId?: string;
  subCategoryId?: string;
  transactionId?: string;
  productId?: string;
  cartId?: string;
  cartItemId?: string;
  orderId?: string;
  orderItemId?: string;
  shipmentId?: string;
  commentId?: string;
  rateId?: string;
  likeId?: string;
  imageId?: string;
  cityId?: string;
  districtId?: string;
  wardId?: string;
  cityCode?: number;
  districtCode?: number;

  hasSub?: boolean;
  hasCate?: boolean;
  hasLike?: boolean;
  staffOnly?: boolean
  convertLang?: boolean;
  admin?: boolean;

  role?: ERole;
  gender?: EGender;
  langCode?: ELang;
}
