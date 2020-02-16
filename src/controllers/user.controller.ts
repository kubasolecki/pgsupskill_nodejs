import * as express from 'express';
import { Request, Response } from 'express';

import IBaseController from '../interfaces/base.interface';
import UserModel, { IUser } from '../models/user';

class UsersController implements IBaseController {
  public path = '/users';
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.get(this.path, this.index);
    this.router.get(`${this.path}/create`, this.create)
  }

  async index(req: Request, res: Response): Promise<void> {
    const users = await UserModel.find().select('email firstName');

    res.json({
      data: users,
    });
  }

  create(req: Request, res: Response): void {
    const user = new UserModel({
      email: 'kuba@email.com',
      firstName: 'kuba',
      lastName: 'pgs',
    });

    user.save()
      .then((savedUser: IUser) => {
        res.json(savedUser);
      })
      .catch(err => res.send(err));
  }
}

export default UsersController;
