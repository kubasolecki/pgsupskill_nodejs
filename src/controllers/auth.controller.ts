import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import UserModel from '../models/user';
import WrongCredentialsException from '../exceptions/wrong-credentials.exception';
import UserEmailAlreadyExistsException from '../exceptions/user-email-already-exists.exception';
import config from '../../env';
import { Upskill } from '../types/auth';
import validationMiddleware from '../middleware/validation.middleware';
import CreateUserDto from '../validators/create-user.dto';

const router = Router();

router.post(
  '/register',
  validationMiddleware(CreateUserDto),
  async (request: Request, response: Response, next: NextFunction) => {
    const userData: Upskill.Auth.CreateUser = request.body;
    try {
      const foundUser = await UserModel.findOne({ email: userData.email });

      if (foundUser) {
        next(new UserEmailAlreadyExistsException(foundUser.email));
      } else {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await UserModel.create({
          ...userData,
          password: hashedPassword,
        });
        const tokenData = createToken(user);
        response.setHeader('Set-Cookie', [createCookie(tokenData)]);

        response.send({
          data: {
            user: { email: user.email },
          },
          message: 'User successfully created',
        });
      }
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/login',
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const user = await UserModel.findOne({ email: request.body.email });

      if (user) {
        const isPasswordMatching = await bcrypt.compare(
          request.body.password,
          user.password
        );
        if (isPasswordMatching) {
          const tokenData = createToken(user);
          response.setHeader('Set-Cookie', [createCookie(tokenData)]);
          response.send({
            data: {
              user: { email: user.email },
            },
            message: 'User successfully created',
          });
        } else {
          next(new WrongCredentialsException());
        }
      } else {
        next(new WrongCredentialsException());
      }
    } catch (err) {
      next(err);
    }
  }
);

router.post('/logout', (request: Request, response: Response) => {
  response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
  response.send(200);
});

const createToken = (user: Upskill.Auth.User): Upskill.Auth.TokenData => {
  const expiresIn = 60 * 60; // an hour
  const secret = config.JWT_SECRET;
  const dataStoredInToken: Upskill.Auth.DataStoredInToken = {
    _id: user._id,
  };
  return {
    expiresIn,
    token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
  };
};

const createCookie = (tokenData: Upskill.Auth.TokenData) => {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
};

export default router;
