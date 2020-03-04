import { Router, Request, Response } from 'express';

import {
  authorizeUser,
  checkCredentials,
  logout,
} from '../services/auth.service';
import { findByEmail, createUser } from './../../user/services/user.service';
import { GenericRequest, ApiResponse } from '../../../types/controller';
import UserEmailAlreadyExistsException from '../../user/exceptions/user-email-already-exists.exception';
import CreateUserDto from '../validators/create-user.dto';
import LoginUserDto from '../validators/login-user.dto';
import { validationWrapper } from '../../../middleware/validation.wrapper';
import { AuthTypes } from '../auth';
import { UserTypes } from '../../user/user';
import WrongCredentialsException from '../exceptions/wrong-credentials.exception';

const router = Router();

router.post(
  '/register',
  validationWrapper<UserTypes.CreateUser, ApiResponse<{user: { email: string }}>>(
    CreateUserDto,
    async (
      request: GenericRequest<UserTypes.CreateUser>,
      response: Response
    ) => {
      const userData = request.model;
      if (!userData) {
        throw new WrongCredentialsException();
      }

      const foundUser = await findByEmail(userData.email);

      if (foundUser) {
        throw new UserEmailAlreadyExistsException(foundUser.email);
      } else {
        const user = await createUser(userData);

        authorizeUser(user, response);

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

router.post(
  '/login',
  validationWrapper<AuthTypes.LoginUser, ApiResponse<{user: { email: string }}>>(
    LoginUserDto,
    async (
      request: GenericRequest<AuthTypes.LoginUser>,
      response: Response
    ) => {
      if (!request.model) {
        throw new WrongCredentialsException();
      }
      const foundUser = await checkCredentials(request.model);

      authorizeUser(foundUser, response);

      return {
        data: {
          user: { email: foundUser.email },
        },
        message: 'Successfully logged in',
      };
    }
  )
);

router.post('/logout', (request: Request, response: Response) => {
  logout(response);
  response.send(200);
});

export default router;
