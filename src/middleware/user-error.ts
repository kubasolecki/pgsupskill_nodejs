import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/http-exception';

function errorHandler(error: HttpException, request: Request, response: Response, next: NextFunction) {
  
  if(request.method === 'GET') {
    const status = 402;
    const message = 'Bad method, use POST instead';
    response
      .status(status)
      .send({
        status,
        message,
      })
  }
  next(error);

}

export default errorHandler;