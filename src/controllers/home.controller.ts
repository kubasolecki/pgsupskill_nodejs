import { Router, Request, Response } from 'express';
import HttpException from '../exceptions/http-exception';

const router = Router();

router.get('/', (_: Request, response: Response) => {
  throw new HttpException(400, 'home');
  response.send('home');
});

export default router;