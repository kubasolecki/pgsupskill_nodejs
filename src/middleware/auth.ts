import { NextFunction, Response, Request } from 'express';
import jwt from 'jsonwebtoken';

import UserModel from '../models/user';
import WrongTokenException from '../exceptions/wrong-token.exception';
import env from '../../env';
import { Upskill } from '../types/auth';

type AuthorizedRequest = { user?: Upskill.Auth.User } & Request;


const authMiddleware = async (request: AuthorizedRequest, response: Response, next: NextFunction ) => {
  const cookies = request.cookies;
  
  if (cookies && cookies.Authorization) {
    const secret = env.JWT_SECRET;
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
  } else {
    next(new WrongTokenException());
  }
}

export default authMiddleware