import loggerMiddleware from './middleware/logger.middleware';
import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import errorHandler from './middleware/error.middleware';
import env from '../env';
import controllers from './routes';

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api', loggerMiddleware);
app.use('/api', controllers);

app.use(errorHandler);

mongoose
  .connect(env.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log('Successfully connected to the database'))
  .catch(err => console.error(err));

app.listen(env.PORT, () => {
  console.log(`Listening on: http://localhost:${env.PORT}`);
});
