import * as express from 'express';
import { Request, Response } from 'express';

import IBaseController from '../interfaces/base.interface';

class HomeController implements IBaseController {
  public path = '/';
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes(): void {
    this.router.get(this.path, this.homepage);
  }

  homepage(req: Request, res: Response): void {
    res.send('Homepage');
  }
}

export default HomeController