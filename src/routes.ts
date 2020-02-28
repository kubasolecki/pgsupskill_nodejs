import { Router } from 'express';

import UserController from './modules/user/controllers/user.controller';
import AuthController from './modules/auth/controllers/auth.controller';
import authMiddleware from './middleware/auth.middleware';

const router = Router();

router.use('/user', authMiddleware, UserController);
router.use('/auth', AuthController);

export default router;