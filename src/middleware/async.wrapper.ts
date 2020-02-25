import { Request, Response, NextFunction } from 'express';
import { AppController } from '../types/controller';

export function asyncWrapper<K>(controller: AppController<any, K>) {
    return async (request: Request, response: Response, next: NextFunction) => {
        try {
            const result = await controller(request, response, next);
            if (result !== undefined) {
                response.send(result);
            }
        } catch(ex) {
            next(ex);
        }
    };
};
