import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import UserModel from 'models/user';

import { RequestWithUser } from '../interfaces/request-with-user.interface';
import { DataStoredInToken } from '../interfaces/data-stored-in-token.interface';
import WrongTokenException from '../exceptions/wrong-token.exception';

async function authMiddleware(
  request: RequestWithUser,
  response: Response,
  next: NextFunction
) {
  const cookies = request.cookies;
  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET;
    try {
      const verificationResponse = jwt.verify(
        cookies.Authorization,
        secret
      ) as DataStoredInToken;
      const id = verificationResponse._id;
      const user = await UserModel.findById(id);
      if (user) {
        request.user = user;
        next();
      } else {
        next(new WrongTokenException());
      }
    } catch (error) {
      next(new WrongTokenException());
    }
  } else {
    next(new WrongTokenException());
  }
}

export default authMiddleware;
