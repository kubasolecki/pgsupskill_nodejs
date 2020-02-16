import 'dotenv/config';

import * as mongoose from 'mongoose';
import * as express from 'express';
import { Application } from 'express';



interface IAppInit {
  middlewares: any;
  controllers: any;
}

class App {
  public app: Application;

  constructor(appInit: IAppInit) {
    this.app = express();

    this.initializeDatabase();
    this.middlewares(appInit.middlewares);
    this.initializeControllers(appInit.controllers);
  }

  private middlewares(middleWares) {
    middleWares.forEach(middleWare => {
      this.app.use(middleWare);
    });
  }

  private initializeControllers(controllers) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  private initializeDatabase() {
    mongoose
      .connect(process.env.MONGO_URI, { useNewUrlParser: true })
      .then(() => console.log('Successfully connected to the database'))
      .catch(err => console.error(err));
  }

  public listen(): void {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the http://localhost:${process.env.PORT}`);
    });
  }
}

export default App;
