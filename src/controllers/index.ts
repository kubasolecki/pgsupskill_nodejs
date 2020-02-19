import { Router } from 'express';
import UserController from './user.controller';
import HomeController from './home.controller';
import userErrorHandler from '../middleware/user-error';

const router = Router();

router.use('/user', UserController);
router.use('/user', userErrorHandler);
router.use('/home', HomeController);

export default router;