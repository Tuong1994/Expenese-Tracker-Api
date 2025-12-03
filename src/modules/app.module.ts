import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CityModule } from './city/city.module';
import { DistrictModule } from './district/district.module';
import { WardModule } from './ward/ward.module';
import { UploadModule } from './upload/upload.module';
import { ExcelModule } from './excel/excel.module';
import { ExportModule } from './export/export.module';
import { EmailModule } from './email/email.module';
import { SettingModule } from './setting/setting.module';
import { GlobalModule } from './global/global.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { TransactionModule } from './transaction/transaction.module';
import { CategoryModule } from './category/category.module';
import { MethodBasedThrottlerGuard } from 'src/common/guard/throllter.guard';
import { StatisticModule } from './statistic/statistic.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: [`.env.${process.env.NODE_ENV}`] }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 40,
        },
      ],
    }),
    PrismaModule,
    CloudinaryModule,
    ExcelModule,
    EmailModule,
    StatisticModule,
    UserModule,
    AuthModule,
    CategoryModule,
    TransactionModule,
    CityModule,
    DistrictModule,
    WardModule,
    UploadModule,
    ExportModule,
    SettingModule,
    GlobalModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: MethodBasedThrottlerGuard,
    },
  ],
})
export class AppModule {}
