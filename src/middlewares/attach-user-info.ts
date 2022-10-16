import { HttpException } from '@/exceptions';
import { NextFunction, Request, Response } from 'express';
import { prisma, verify as verifyToken } from '@/resources';
import { Route, services } from '@/services';

type ServiceName = typeof services[number];
export default (service: ServiceName | undefined, route: Route) =>
  async (req: Request, Res: Response, next: NextFunction) => {
    try {
      if (!route.needAuth) {
        return next();
      }

      if (!req.token) {
        throw new HttpException(
          401,
          '액세스 토큰이 Authorization 헤더에 Bearer Token Type으로 전송되어야 합니다.'
        );
      }

      const { token } = req;

      const identity = await verifyToken(token);

      if (!identity) {
        throw new HttpException(400, '잘못된 Token입니다.');
      }

      req.auth = {
        id: identity.id,
      };
      next();
    } catch (err) {
      return next(err);
    }
  };
