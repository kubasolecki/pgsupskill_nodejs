import { Router, Request, Response } from 'express';
import UserModel, { IUser } from '../models/user';

const router = Router();

router.get('/', async (_: Request, response: Response) => {
  const users = await UserModel.find().select('email firstName');

  response.json({
    data: users,
  });
});

router.post('/', (request: Request, response: Response) => {
  const user = new UserModel({
    email: 'kuba@email.com',
    firstName: 'kuba',
    lastName: 'pgs',
  });

  user
    .save()
    .then((savedUser: IUser) => {
      response.json(savedUser);
    })
    .catch(err => response.status(400).send(err));
});

export default router;
