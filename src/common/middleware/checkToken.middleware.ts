import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import responseMessage from '../message';

const { NO_TOKEN } = responseMessage;

@Injectable()
export class CheckTokenMiddle implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.cookies.tokenPayload) throw new ForbiddenException(NO_TOKEN);
    const { token: accessToken } = req.cookies.tokenPayload;
    if (!accessToken) throw new ForbiddenException(NO_TOKEN);
    next();
  }
}
