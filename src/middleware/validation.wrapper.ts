import { plainToClass } from 'class-transformer';
import { RequestHandler, NextFunction, Request, Response } from 'express';

import HttpException from '../exceptions/http.exception';
import { BAD_REQUEST } from '../status_codes';
import { ClassType } from 'class-transformer/ClassTransformer';
import { asyncWrapper } from './async.wrapper';
import { AppController, GenericRequest } from '../types/controller';
import { validate, ValidationError } from 'class-validator';

export function validationWrapper<T, K>(
  type: ClassType<T>,
  controller: AppController<T, K>,
  skipMissingProperties = false
): RequestHandler {
  return asyncWrapper<K>(
    async (
      request: GenericRequest<T>,
      response: Response,
      next: NextFunction
    ) => {
      const classObject = plainToClass(type, request.body);
      validate(classObject, { skipMissingProperties })
      .then(async (errors) => {
        if (errors.length > 0) {
          const message = errors
          .map((error: ValidationError) => Object.values(error.constraints))
          .join(', ');
          next(new HttpException(BAD_REQUEST, message));
        } else {
          request.model = classObject;
          return await controller(request, response, next);
        }
      });
    }
  );
}
