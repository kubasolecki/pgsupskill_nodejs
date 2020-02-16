import App from './app';

import * as bodyParser from 'body-parser';
import loggerMiddleware from './middleware/logger';
import UsersController from './controllers/user.controller';
import HomeController from './controllers/home.controller';

const app = new App({
  controllers: [
    new HomeController(),
    new UsersController()
  ],
  middlewares: [
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    loggerMiddleware,
  ],
});

app.listen();
