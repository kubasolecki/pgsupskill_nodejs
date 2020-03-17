import { Router, Request, Response } from 'express';

import { AuthService } from '../services/auth.service';
import { GenericRequest, ApiResponse } from '@/types/controller';
import UserEmailAlreadyExistsException from '@/modules/user/exceptions/user-email-already-exists.exception';
import LoginUserDto from '../validators/login-user.dto';
import { validationWrapper } from '@/middleware/validation.wrapper';
import { AuthTypes } from '../auth';
import WrongCredentialsException from '../exceptions/wrong-credentials.exception';
import RegisterUserDto from '../validators/register-user.dto';

const router = Router();
const authService = new AuthService();

router.post(
  '/register',
  validationWrapper<AuthTypes.User, ApiResponse<{ user: { email: string } }>>(
    RegisterUserDto,
    async (request: GenericRequest<AuthTypes.User>, response: Response) => {

      const userData = request.model;
      if (!userData) {
        throw new WrongCredentialsException();
      }

      const foundUser = await authService.findByEmail(userData.email);

      if (foundUser) {
        throw new UserEmailAlreadyExistsException(foundUser.email);
      } else {
        userData.password = await authService.hashPassword(userData.password);
        const user = await authService.create(userData);

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
  validationWrapper<
    AuthTypes.LoginUser,
    ApiResponse<{ user: { email: string } }>
  >(
    LoginUserDto,
    async (
      request: GenericRequest<AuthTypes.LoginUser>,
      response: Response
    ) => {
      if (!request.model) {
        throw new WrongCredentialsException();
      }
      const foundUser = await authService.checkCredentials(request.model);

      authService.authorizeUser(foundUser, response);

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
  authService.logout(response);
  response.send(200);
});

export default router;
