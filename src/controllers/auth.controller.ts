import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';

import UserModel from '../models/user';
import WrongCredentialsException from '../exceptions/wrong-credentials.exception';
import { CreateUser } from '../interfaces/create-user.model';
import UserEmailAlreadyExistsException from '../exceptions/user-email-already-exists.exception';

const router = Router();

router.post(
  '/register',
  async (request: Request, response: Response, next: NextFunction) => {
    const userData: CreateUser = request.body;

    const foundUser = await UserModel.findOne({ email: userData.email });

    if (foundUser) {
      next(new UserEmailAlreadyExistsException(foundUser.email));
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await this.user.create({
        ...userData,
        password: hashedPassword,
      });
      user.password = undefined;
      response.send(user);
    }
  }
);

router.post(
  '/login',
  async (request: Request, response: Response, next: NextFunction) => {
    const user = await UserModel.findOne({ email: request.body.email });

    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        request.body.password,
        user.password
      );
      if (isPasswordMatching) {
        user.password = undefined;
        response.send(user);
      } else {
        next(new WrongCredentialsException());
      }
    } else {
      next(new WrongCredentialsException());
    }
  }
);

export default router;
