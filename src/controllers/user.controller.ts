import { Router, Request, Response, NextFunction } from 'express';
import UserModel, { IUser } from '../models/user';
import HttpException from '../exceptions/http-exception';

const router = Router();

router.get('/', async (_: Request, response: Response, next: NextFunction) => {
  try {
    throw new HttpException(400, 'GET USER');
    const users = await UserModel.find().select('email firstName');

    response.json({
      data: users,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/', (request: Request, response: Response, next: NextFunction) => {
  const user = new UserModel({
    email: 'kuba@email.com',
    firstName: 'kuba',
    lastName: 'pgs',
  });

  try {
    throw new HttpException(400, 'POST USER');
    user
      .save()
      .then((savedUser: IUser) => {
        response.json(savedUser);
      })
      .catch(err => response.status(400).send(err));
  } catch (err) {
    next(err);
  }
});

export default router;
