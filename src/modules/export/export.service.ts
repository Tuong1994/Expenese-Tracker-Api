import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ExcelService } from '../excel/excel.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { ERole } from 'src/common/enum/base';
import { WorkSheetColumns } from './export.type';
import { Response } from 'express';
import { getAddress, getGender, getRole } from './helpers/customer';
import utils from 'src/utils';
import moment = require('moment');

@Injectable()
export class ExportService {
  constructor(
    private prisma: PrismaService,
    private excelService: ExcelService,
  ) {}

  private resHeaderContentTypeValue = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

  private resHeaderContentDispositionValue = 'attachment; filename=';

  async userExport(query: QueryDto, res: Response) {
    const { langCode, staffOnly } = query;
    const lang = utils.getLang(langCode);

    const users = await this.prisma.user.findMany({
      where: {
        AND: [
          { isDelete: { equals: false } },
          { role: staffOnly ? { not: ERole.CUSTOMER } : { equals: ERole.CUSTOMER } },
        ],
      },
      include: { address: true },
    });
    const exportData = users.map((user) => ({
      ...user,
      birthday: moment(user.birthday).format('DD/MM/YYYY'),
      gender: getGender(user.gender, langCode),
      role: getRole(user.role, langCode),
      address: user.address ? getAddress(user.address, langCode) : lang.excel.others.none,
    }));
    const columns: WorkSheetColumns = [
      { header: lang.excel.header.email, key: 'email' },
      { header: lang.excel.header.userName, key: 'fullName' },
      { header: lang.excel.header.phone, key: 'phone' },
      { header: lang.excel.header.gender, key: 'gender' },
      { header: lang.excel.header.birthday, key: 'birthday' },
      { header: lang.excel.header.role, key: 'role' },
      { header: lang.excel.header.address, key: 'address' },
    ];

    const { workBook } = this.excelService.generateExcel(exportData, columns, 'Users');
    const buffer = await workBook.xlsx.writeBuffer();
    res.setHeader('Content-Type', this.resHeaderContentTypeValue);
    res.setHeader('Content-Disposition', this.resHeaderContentDispositionValue + 'users.xlsx');
    res.send(buffer);
  }
}
