import { Router, Request, Response } from 'express';

import {
  authorizeUser,
  checkCredentials,
  logout,
} from './../services/auth.service';
import { findByEmail, createUser } from './../../user/services/user.service';
import { GenericRequest } from '../../../types/controller';
import WrongCredentialsException from '../exceptions/wrong-credentials.exception';
import UserEmailAlreadyExistsException from '../../user/exceptions/user-email-already-exists.exception';
import CreateUserDto from '../../../validators/create-user.dto';
import LoginUserDto from '../../../validators/login-user.dto';
import { validationWrapper } from '../../../middleware/validation.wrapper';
import { AuthTypes } from '../auth';

const router = Router();

router.post(
  '/register',
  validationWrapper<CreateUserDto, AuthTypes.RegisterUserResponse>(
    CreateUserDto,
    async (request: GenericRequest<CreateUserDto>, response: Response) => {
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
  validationWrapper<LoginUserDto, AuthTypes.LoginUserResponse>(
    LoginUserDto,
    async (request: GenericRequest<LoginUserDto>, response: Response) => {
      const foundUser = await checkCredentials(request.model)

      authorizeUser(foundUser, response);

      return {
        data: {
          user: { email: foundUser?.email },
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
