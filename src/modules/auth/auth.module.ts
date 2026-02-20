import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStategy } from 'src/common/strategy/jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthHelper } from './auth.helper';
import { EmailHelper } from '../email/email.helper';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from 'src/common/strategy/google.strategy';
import { UserHelper } from '../user/user.helper';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'google' }), JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AuthHelper, EmailHelper, UserHelper, JwtService, JwtStategy, GoogleStrategy],
})
export class AuthModule {}
