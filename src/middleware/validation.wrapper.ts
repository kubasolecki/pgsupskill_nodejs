import { plainToClass } from 'class-transformer';
import { RequestHandler, NextFunction, Request, Response } from 'express';

import HttpException from '../exceptions/http.exception';
import { BAD_REQUEST } from '../status_codes';
import { ClassType } from 'class-transformer/ClassTransformer';
import { asyncWrapper } from './async.wrapper';
import { AppController, GenericRequest } from '../types/controller';

export function validationWrapper<T, K>(
    type: ClassType<T>,
    controller: AppController<GenericRequest<T>, K>,
    skipMissingProperties = false): RequestHandler {
  return asyncWrapper<K>(async (request: Request, response: Response, next: NextFunction) => {
      // TODO: tutaj dodaj całą logikę validate middelware i przepchnij dane do requestu
      // ale już w formie faktycznej klasy a nie body
    return await controller(request, response, next);
  })
}

