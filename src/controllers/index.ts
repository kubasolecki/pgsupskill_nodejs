import { Router } from 'express';
import UserController from './user.controller';
import HomeController from './home.controller';
import AuthController from './auth.controller';

const router = Router();

router.use('/user', UserController);
router.use('/auth', AuthController);
router.use('/', HomeController);

export default router;