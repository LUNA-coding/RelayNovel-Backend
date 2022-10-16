import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import config from '@/config';
import { HttpException } from '@/exceptions';

export const verify = async (token?: string) => {
  if (!token) return null;
  try {
    const { identity }: any = await jwt.verify(
      token,
      config.jwtSecret as string
    );
    return identity;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new HttpException(418, '토큰이 만료되었습니다.');
    } else if (['jwt malformed', 'invalid signature'].includes(error.message)) {
      throw new HttpException(401, '토큰이 변조되었습니다.');
    } else throw new HttpException(401, '토큰에 문제가 있습니다.');
  }
};

export const issue = (identity: User) => {
  const token = jwt.sign(
    {
      identity: {
        id: identity.id,
      },
    },
    config.jwtSecret as string,
    {
      algorithm: 'HS512',
      expiresIn: '1y',
    }
  );
  return token;
};
