import { User } from '@prisma/client';
import express from 'express';

declare global {
  namespace Express {
    interface Request {
      auth?: { id: User['id'] };
    }
  }
}
