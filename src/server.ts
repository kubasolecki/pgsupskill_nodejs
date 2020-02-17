import loggerMiddleware from './middleware/logger';
import mongoose from 'mongoose';
import env from '../env';

import express from 'express';
import controllers from './controllers';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());

app.use('/api', loggerMiddleware);
app.use('/api', controllers);

mongoose
  .connect(env.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log('Successfully connected to the database'))
  .catch(err => console.error(err));

app.listen(env.PORT, () => {
  console.log(`Listening on: http://localhost:${env.PORT}`);
});
