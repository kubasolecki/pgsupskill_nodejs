import { Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { findByEmail } from './../../user/services/user.service';
import { UserTypes } from '../../user/user';
import { AuthTypes } from '../auth';
import config from '../../../../env';
import WrongCredentialsException from '../exceptions/wrong-credentials.exception';
import env from '../../../../env';

const SALT_OR_ROUNDS = 10;

export const authorizeUser = (user: UserTypes.User, response: Response) => {
  const tokenData = createToken(user);
  response.setHeader('Set-Cookie', [createCookie(tokenData)]);
};

export const checkCredentials = async (user: AuthTypes.LoginUser) => {
  const foundUser = await findByEmail(user.email);

  if (!foundUser) {
    throw new WrongCredentialsException();
  }

  if (!(await isPasswordMatching(user.password, foundUser.password))) {
    throw new WrongCredentialsException();
  }

  return foundUser;
};

export const hashPassword = (password: string) =>
  bcrypt.hash(password, SALT_OR_ROUNDS);

export const createToken = (user: UserTypes.User): AuthTypes.TokenData => {
  const expiresIn = env.TOKEN_EXPIRES_IN;
  const secret = config.JWT_SECRET;
  const dataStoredInToken: AuthTypes.DataStoredInToken = {
    _id: user._id,
  };
  return {
    expiresIn,
    token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
  };
};

export const createCookie = (tokenData: AuthTypes.TokenData) => {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
};

export const logout = (response: Response) => {
  response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
};

const isPasswordMatching = async (
  password: string,
  compareToPassword: string
) => await bcrypt.compare(password, compareToPassword);
