import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { QueryPaging } from 'src/common/decorator/query.decorator';
import { CategoryDto } from './category.dto';

@Controller('api/category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('list')
  @HttpCode(HttpStatus.OK)
  getCategories(@Query() query: QueryDto) {
    return this.categoryService.getCategories(query);
  }

  @Get('listPaging')
  @HttpCode(HttpStatus.OK)
  getCategoriesPaging(@QueryPaging() query: QueryDto) {
    return this.categoryService.getCategoriesPaging(query);
  }

  @Get('detail')
  @HttpCode(HttpStatus.OK)
  getCategory(@Query() query: QueryDto) {
    return this.categoryService.getCategory(query);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  createCategory(@Body() category: CategoryDto) {
    return this.categoryService.createCategory(category);
  }

  @Put('update')
  @HttpCode(HttpStatus.OK)
  updateCategory(@Query() query: QueryDto, @Body() category: CategoryDto) {
    return this.categoryService.updateCategory(query, category);
  }

  @Delete('remove')
  @HttpCode(HttpStatus.OK)
  removeCategories(@Query() query: QueryDto) {
    return this.categoryService.removeCategories(query);
  }

  @Delete('removePermanent')
  @HttpCode(HttpStatus.OK)
  removeCategoriesPermanent(@Query() query: QueryDto) {
    return this.categoryService.removeCategoriesPermanent(query);
  }

  @Post('restore')
  @HttpCode(HttpStatus.OK)
  restoreCategories() {
    return this.categoryService.restoreCategories();
  }
}
