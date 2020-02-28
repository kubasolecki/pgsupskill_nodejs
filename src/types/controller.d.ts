import { Request, Response, NextFunction } from 'express';

export type AppController<T = undefined, K = void> = (request: Request & { model?: T }, response: Response, next: NextFunction) => K | Promise<K>;

export type GenericRequest<T> = Request & { model?: T };