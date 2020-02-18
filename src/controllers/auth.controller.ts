import { IUser } from './../models/user';
import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import UserModel from '../models/user';
import WrongCredentialsException from '../exceptions/wrong-credentials.exception';
import { CreateUser } from '../interfaces/create-user.interface';
import UserEmailAlreadyExistsException from '../exceptions/user-email-already-exists.exception';
import { TokenData } from '../interfaces/token-data.interface';
import { DataStoredInToken } from '../interfaces/data-stored-in-token.interface';

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
      const tokenData = createToken(user);
      response.setHeader('Set-Cookie', [createCookie(tokenData)]);

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
        const tokenData = createToken(user);
        response.setHeader('Set-Cookie', [createCookie(tokenData)]);
        response.send(user);
      } else {
        next(new WrongCredentialsException());
      }
    } else {
      next(new WrongCredentialsException());
    }
  }
);

router.post(
  '/logout',
  (request: Request, response: Response) => {
    response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
    response.send(200);
  }
);

const createToken = (user: IUser): TokenData => {
  const expiresIn = 60 * 60; // an hour
  const secret = process.env.JWT_SECRET;
  const dataStoredInToken: DataStoredInToken = {
    _id: user._id,
  };
  return {
    expiresIn,
    token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
  };
};

const createCookie = (tokenData: TokenData) => {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
};

export default router;
