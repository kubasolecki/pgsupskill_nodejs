import { Router } from 'express';
import UserController from './user.controller';
import HomeController from './home.controller';
import AuthController from './auth.controller';

const router = Router();

/*
    TODO:
    w ten sposób precyzyjnie mówimy że chodzi nam o ten kontroler a nie przypadkowo zbieżne string
*/

router.use('/user', UserController);

router.use('/auth', AuthController);
router.use('/', HomeController);

export default router;