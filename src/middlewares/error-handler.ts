import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@/exceptions';
import { logger } from '@/resources';

const sendError = (res: Response, status: number, message: string) => {
  res.status(status).json({ message });
};

const errorHandler = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(error);
  switch (error.name) {
    case 'HttpException': {
      const { name, status = 500, message } = error as HttpException;
      logger.error(`[${name}]${message}`);
      sendError(res, status, message);
      break;
    }
    default: {
      logger.error(JSON.stringify(error));
      sendError(res, 500, '알 수 없는 에러가 발생했습니다.');
      break;
    }
  }
};

export default errorHandler;