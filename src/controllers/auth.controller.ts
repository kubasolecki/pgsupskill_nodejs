import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import UserModel from '../models/user';
import WrongCredentialsException from '../exceptions/wrong-credentials.exception';
import UserEmailAlreadyExistsException from '../exceptions/user-email-already-exists.exception';
import config from '../../env';
import { Upskill } from '../types/auth';

const router = Router();

router.post(
  '/register',
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
          /* 
            TODO: 
            z jednej strony na interfejsie mówisz że password jest typu string :)
            a potem chcesz go ustawić na undefined. typescript na to nie pozwala! 
            jeśli chcesz zrobić
            user.password = undefined
            musisz w interface dać

            interface User extends Document {
                _id: string;
                name: string;
                email: string;
                password?: string;
              }


          */
          const { email, _id } = user;
          const tokenData = createToken(user);
          response.setHeader('Set-Cookie', [createCookie(tokenData)]);
          response.send({
            email,
            _id
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
  /* 
  TODO:
  jeśli używałeś process.env... to każda z jego propert jest string | undefined
  przecieka Ci przez palce możliwy undefined
  */
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
