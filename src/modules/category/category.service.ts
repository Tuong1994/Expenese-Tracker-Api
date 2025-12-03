import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Category } from '@prisma/client';
import { ELang } from 'src/common/enum/base';
import { Paging } from 'src/common/type/base';
import { CategoryHelper } from './category.helper';
import { CategoryDto } from './category.dto';
import responseMessage from 'src/common/message';
import utils from 'src/utils';

const { CREATE_ERROR, UPDATE_SUCCESS, NOT_FOUND, NO_DATA_RESTORE, RESTORE_SUCCESS, REMOVE_SUCCESS } = responseMessage;

@Injectable()
export class CategoryService {
  constructor(
    private prisma: PrismaService,
    private categoryHelper: CategoryHelper,
  ) {}

  async getCategories(query: QueryDto) {
    const { keywords, sortBy, langCode } = query;
    const categories = await this.prisma.category.findMany({
      where: { isDelete: { equals: false } },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
    });
    let filterCategories: Category[] = [];
    if (keywords) {
      filterCategories = categories.filter((category) => {
        langCode === ELang.EN
          ? utils.filterByKeywords(category.nameEn, keywords)
          : utils.filterByKeywords(category.nameVn, keywords);
      });
    }
    const items = this.categoryHelper.convertCollection(keywords ? filterCategories : categories, langCode);
    return { total: keywords ? filterCategories.length : categories.length, items };
  }

  async getCategoriesPaging(query: QueryDto) {
    const { page, limit, keywords, sortBy, langCode } = query;
    let collection: Paging<Category> = utils.defaultCollection();
    const categories = await this.prisma.category.findMany({
      where: { isDelete: { equals: false } },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
    });
    if (keywords) {
      const filterCategories = categories.filter((category) => {
        langCode === ELang.EN
          ? utils.filterByKeywords(category.nameEn, keywords)
          : utils.filterByKeywords(category.nameVn, keywords);
      });
      collection = utils.paging<Category>(filterCategories, page, limit);
    } else collection = utils.paging<Category>(categories, page, limit);
    const items = this.categoryHelper.convertCollection(collection.items, langCode);
    return { ...collection, items };
  }

  async getCategory(query: QueryDto) {
    const { categoryId } = query;
    const category = await this.prisma.category.findUnique({ where: { id: categoryId } });
    return category
  }

  async createCategory(category: CategoryDto) {
    const { nameEn, nameVn, type } = category;
    const newCategory = await this.prisma.category.create({ data: { nameEn, nameVn, type, isDelete: false } });
    if (!newCategory) throw new HttpException(CREATE_ERROR, HttpStatus.BAD_GATEWAY);
    return newCategory;
  }

  async updateCategory(query: QueryDto, category: CategoryDto) {
    const { categoryId } = query;
    const { nameEn, nameVn, type } = category;
    await this.prisma.category.update({
      where: { id: categoryId },
      data: { nameEn, nameVn, type },
    });
    throw new HttpException(UPDATE_SUCCESS, HttpStatus.OK);
  }

  async removeCategories(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const categories = await this.prisma.category.findMany({ where: { id: { in: listIds } } });
    if (categories && !categories.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.category.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
    throw new HttpException(REMOVE_SUCCESS, HttpStatus.OK);
  }

  async removeCategoriesPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const categories = await this.prisma.category.findMany({ where: { id: { in: listIds } } });
    if (categories && !categories.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.category.deleteMany({ where: { id: { in: listIds } } });
    throw new HttpException(REMOVE_SUCCESS, HttpStatus.OK);
  }

  async restoreCategories() {
    const categories = await this.prisma.category.findMany({ where: { isDelete: { equals: true } } });
    if (categories && !categories.length) throw new HttpException(NO_DATA_RESTORE, HttpStatus.OK);
    await Promise.all(categories.map(async (category) => await this.categoryHelper.handleRestoreCategory(category)));
    throw new HttpException(RESTORE_SUCCESS, HttpStatus.OK);
  }
}
