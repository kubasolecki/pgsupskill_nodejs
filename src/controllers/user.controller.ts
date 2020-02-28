import { Router, Request, Response } from 'express';
import UserModel from '../models/user';
import { Upskill } from '../types/auth';
import authMiddleware from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', async (_: Request, response: Response) => {
  const users = await UserModel.find();

  response.json({
    data: users,
  });
});

export default router;
