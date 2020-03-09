import { Router, Request, Response } from 'express';

import authMiddleware from '@/middleware/auth.middleware';
import UserModel from '../models/user.model';
import { UserService } from '../services/user.service';

const router = Router();

router.use(authMiddleware);

router.get('/', async (_: Request, response: Response) => {
  const users = await UserModel.find();

  const userService = new UserService();

  userService.create(_.body) // TODO: implement typed parameter

  response.json({
    data: users,
  });
});

export default router;
