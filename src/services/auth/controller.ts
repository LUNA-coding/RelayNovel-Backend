import { Request, Response } from 'express';
import { issue, prisma } from '@/resources';
import { HttpException } from '@/exceptions';
import crypto from 'crypto';

export const signUp = async (req: Request, res: Response) => {
  const {
    username,
    name,
    password,
  } = req.body;

  const user = await prisma.profile.findFirst({
    where: {
      username,
    },
  });
  if (user) throw new HttpException(401, '이미 등록된 사용자입니다');

  const salt = Math.random().toString(36).substring(2, 12);
  const hashPassword = crypto
    .createHash('sha256')
    .update(password + salt)
    .digest('hex');

  const newUser = await prisma.user.create({
    data: {
      Profile: {
        create: {
          username,
          name,
          Password: {
            create: {
              salt,
              hashPassword,
            },
          },
        },
      },
    },
  });

  res.json({
    token: issue(newUser),
  });
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const pwdInfo = await prisma.profile.findFirst({
    where: {
      username,
    },
    select: {
      Password: {
        select: {
          hashPassword: true,
          salt: true,
        },
      },
    },
  });
  if (!pwdInfo) throw new HttpException(401, '로그인에 실패하였습니다.');

  const hashPassword = crypto
    .createHash('sha256')
    .update(password + pwdInfo.Password.salt)
    .digest('hex');

  const user = await prisma.user.findFirst({
    where: {
      Profile: {
        username,
        Password: {
          hashPassword,
        },
      },
    },
    select: {
      id: true,
      createAt: true,
    },
  });

  if (!user) throw new HttpException(401, '로그인에 실패하였습니다.');

  res.json({
    token: issue(user),
  });
};
