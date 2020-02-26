import { GenericRequest } from './../types/controller.d';
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
import LoginUserDto from '../validators/login-user.dto';
import { asyncWrapper } from '../middleware/async.wrapper';
import { validationWrapper } from '../middleware/validation.wrapper';

const router = Router();

interface IRegisterUserResponse {
  message: string;
  data: {
    user: {
      email: string;
    };
  };
}

router.post(
  '/register',
  validationWrapper<CreateUserDto, IRegisterUserResponse>(
    CreateUserDto,
    async (request: GenericRequest<CreateUserDto>, response: Response) => {
      const userData = request.model;
      const foundUser = await UserModel.findOne({ email: userData?.email });

      if (foundUser) {
        throw new UserEmailAlreadyExistsException(foundUser.email);
      } else {
        const hashedPassword = await bcrypt.hash(userData?.password, 10);
        const user = await UserModel.create({
          ...userData,
          password: hashedPassword,
        });
        const tokenData = createToken(user);
        response.setHeader('Set-Cookie', [createCookie(tokenData)]);

        return {
          data: {
            user: { email: user.email },
          },
          message: 'User successfully created',
        };
      }
    }
  )
);

interface ILoginUserResponse {
  message: string;
  data: {
    user: {
      email: string;
    };
  };
}

router.post(
  '/login',
  validationWrapper<LoginUserDto, ILoginUserResponse>(
    LoginUserDto,
    async (request: GenericRequest<LoginUserDto>, response: Response) => {
      const user = await UserModel.findOne({ email: request.model?.email });
      if (!user) {
        throw new WrongCredentialsException();
      }
      const isPasswordMatching = await bcrypt.compare(
        request.model?.password,
        user.password
      );
      if (!isPasswordMatching) {
        throw new WrongCredentialsException();
      }

      const tokenData = createToken(user);
      response.setHeader('Set-Cookie', [createCookie(tokenData)]);

      return {
        data: {
          user: { email: user.email },
        },
        message: 'Successfully logged in',
      };
    }
  )
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
