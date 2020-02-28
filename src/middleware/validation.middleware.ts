import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';

import HttpException from '../exceptions/http.exception';
import { BAD_REQUEST } from '../status_codes';
import { ClassType } from 'class-transformer/ClassTransformer';

function validationMiddleware<T>(type: ClassType<T>, skipMissingProperties = false): RequestHandler {
  return (reqest, response, next) => {
    validate(plainToClass(type, reqest.body), { skipMissingProperties }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors
          .map((error: ValidationError) => Object.values(error.constraints))
          .join(', ');
        next(new HttpException(BAD_REQUEST, message));
      } else {
        next();
      }
    });
  };
}

export default validationMiddleware;
