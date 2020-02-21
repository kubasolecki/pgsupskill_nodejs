import { Router } from 'express';
import UserController from './user.controller';
import HomeController from './home.controller';
import AuthController from './auth.controller';
import authMiddleware from '../middleware/auth';

const router = Router();
router.use('/user', authMiddleware)
router.use('/user', UserController);
router.use('/auth', AuthController);
router.use('/', HomeController);

export default router;