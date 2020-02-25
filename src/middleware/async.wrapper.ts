import { Request, Response, NextFunction } from 'express';

export function asyncWrapper<K>(controller: (request: Request, response: Response, next: NextFunction) => Promise<void | K>) {
    return async (request: Request, response: Response, next: NextFunction) => {
        try {
            const result = await controller(request, response, next);
            if (result) {
                response.send(result);
            }
        } catch(ex) {
            next(ex);
        }
    };
};
