import { Router, Request, Response } from 'express';

import authMiddleware from '@/middleware/auth.middleware';
import UserModel from '../models/user.model';
import { UserService } from '../services/user.service';
import { ApiResponse, GenericRequest } from '../../../types/controller';
import { UserTypes } from '../user';
import CreateUserDto from '../validators/create-user.dto';
import { validationWrapper } from '../../../middleware/validation.wrapper';
import WrongCredentialsException from '../../auth/exceptions/wrong-credentials.exception';

const router = Router();
const userService = new UserService();

router.use(authMiddleware);

router.get('/', async (_: Request, response: Response) => {
  // const users = await userService.getAll();


  // response.json({
  //   data: users,
  // });
});

router.post('/',
  validationWrapper<UserTypes.CreateUser,ApiResponse<{ user: string }>>(
    CreateUserDto,
    async (
      request: GenericRequest<UserTypes.CreateUser>,
      response: Response
    ) => {
      // const userService = new UserService();

      // const model = request.model;
      // if(!model) {
      //   throw new WrongCredentialsException();
      // }
      
      // const createdUser = await userService.create(model);
      // console.log(createdUser, 'dsdssd');
      return {
        data: {
          user: 'createdUser',
        },
        message: 'User successfully created',
      };
    }
  )
);

export default router;
