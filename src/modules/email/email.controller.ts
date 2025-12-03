import { Body, Controller, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { EmailService } from './email.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { EmailContactDto } from './email.dto';

@Controller('api/email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post('contact')
  @HttpCode(HttpStatus.OK)
  emailContact(@Query() query: QueryDto, @Body() contact: EmailContactDto) {
    return this.emailService.emailContact(query, contact);
  }
}
