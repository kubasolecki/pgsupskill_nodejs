import { NextFunction, Response, Request } from 'express';
import jwt from 'jsonwebtoken';

import WrongTokenException from '../modules/auth/exceptions/wrong-token.exception';
import env from '../../env';
import { UserTypes } from '../modules/user/user';
import { AuthTypes } from '../modules/auth/auth';
import userModel from '../modules/user/models/user.model';

type AuthorizedRequest = { user?: UserTypes.User } & Request;

const authMiddleware = async (
  request: AuthorizedRequest,
  response: Response,
  next: NextFunction
) => {
  const cookies = request.cookies;

  if (cookies && cookies.Authorization) {
    const secret = env.JWT_SECRET;
    try {
      const verificationResponse = jwt.verify(
        cookies.Authorization,
        secret
      ) as AuthTypes.DataStoredInToken;

      const id = verificationResponse._id;
      const user = await userModel.findById(id);

      if (user) {
        request.user = user;
        next();
      }
    } catch (error) {
      next(new WrongTokenException());
    }
  } else {
    next(new WrongTokenException());
  }
};

export default authMiddleware;
