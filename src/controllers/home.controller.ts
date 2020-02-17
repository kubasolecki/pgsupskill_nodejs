import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (_: Request, response: Response) => {
  response.send('home');
});

export default router;