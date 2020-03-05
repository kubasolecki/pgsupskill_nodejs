import { Router, Request, Response } from 'express';

import authMiddleware from '../../../middleware/auth.middleware';
import UserModel from '../models/user.model';

const router = Router();

router.use(authMiddleware);

router.get('/', async (_: Request, response: Response) => {
  const users = await UserModel.find();

  response.json({
    data: users,
  });
});

export default router;
