import { NextFunction, Response, Request } from 'express';
import * as jwt from 'jsonwebtoken';
import UserModel from 'models/user';

import WrongTokenException from '../exceptions/wrong-token.exception';
import { auth } from '../types/auth';

const authMiddleware = async (request: Request, response: Response, next: NextFunction ) => {
  const cookies = request.cookies;
  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET;
    try {
      const verificationResponse = jwt.verify(
        cookies.Authorization,
        secret
      ) as auth.DataStoredInToken;
      const id = verificationResponse._id;
      const user = await UserModel.findById(id);
      if (user) {
        request.user = user;
        next();
      }
    } catch (error) {
      next(new WrongTokenException());
    }
  }
  next(new WrongTokenException());
}

export default authMiddleware;
