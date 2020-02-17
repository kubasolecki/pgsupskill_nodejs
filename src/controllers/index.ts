import { Router } from 'express';
import UserController from './user.controller';
import HomeController from './home.controller';

const router = Router();

router.use('/user', UserController);
router.use('/', HomeController);

export default router;