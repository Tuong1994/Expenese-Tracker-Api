import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { ELang } from 'src/common/enum/base';
import { PrismaService } from '../prisma/prisma.service';
import utils from 'src/utils';

@Injectable()
export class CategoryHelper {
  constructor(private prisma: PrismaService) {}

  convertCollection(categories: Category[], langCode: ELang) {
    return categories.map((category) => ({
      ...utils.convertRecordsName<Category>(category, langCode),
    }));
  }

  async handleRestoreCategory(category: Category) {
    await this.prisma.category.update({ where: { id: category.id }, data: { isDelete: false } });
  }
}
