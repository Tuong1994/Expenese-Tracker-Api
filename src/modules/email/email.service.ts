import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EmailContactDto } from './email.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { ELang } from 'src/common/enum/base';
import { EmailHelper } from './email.helper';
import { getEmailContactTemplate } from '../../common/template/contact';

@Injectable()
export class EmailService {
  constructor(private emailHelper: EmailHelper) {}

  async emailContact(query: QueryDto, contact: EmailContactDto) {
    const { langCode } = query;
    const { email } = contact;

    const subject = langCode === ELang.EN ? 'Contact information' : 'Thông tin liên hệ';
    await this.emailHelper.sendGmail({
      to: email,
      subject,
      html: getEmailContactTemplate(langCode, contact),
    });
    throw new HttpException('Email has been sent', HttpStatus.OK);
  }
}
