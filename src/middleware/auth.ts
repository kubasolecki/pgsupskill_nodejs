import { NextFunction, Response, Request } from 'express';
import * as jwt from 'jsonwebtoken';
import UserModel from '../models/user';
import config from '../../env';
import WrongTokenException from '../exceptions/wrong-token.exception';

interface AuthorizedRequest extends Request {
  user: Upskill.Auth.User
}

export default async function (request: AuthorizedRequest, response: Response, next: NextFunction ) {
  const cookies = request.cookies;
  if (cookies && cookies.Authorization) {
    const secret = config.JWT_SECRET;
    try {
      const verificationResponse = jwt.verify(
        cookies.Authorization,
        secret
      ) as Upskill.Auth.DataStoredInToken;
      const id = verificationResponse._id;
      const user = await UserModel.findById(id);
      if (user) {
        request.user= user;
        next();
      }
    } catch (error) {
      next(new WrongTokenException());
    }
  }
  next(new WrongTokenException());
}
