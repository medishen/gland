import { ServerUtils } from '../helper';
import { Context, MidsFn, NxtFunction } from '../types';
import { Gland } from '../types';
import { Router } from './router';
export namespace Gmids {
  export let mids: MidsFn[] = [];

  export function set(middleware: MidsFn | MidsFn[]) {
    mids = [...mids, ...ServerUtils.normalize(middleware)];
  }

  export function get(): MidsFn[] | [] {
    return mids || [];
  }
}
export namespace midManager {
  export function process(path: string | Gland.Middleware, handlers: (Gland.Middleware | Gland.Middleware[])[], middlewares: Gland.Middleware[]) {
    if (typeof path === 'string') {
      handlers.flat().forEach((handler) => {
        Router.set(handler as any, path);
        if (handler.length === 2 || handler.length === 3) {
          middlewares.push(async (ctx: Context, next: NxtFunction) => {
            if (ctx.url!.startsWith(path)) {
              if (handler.length === 2) {
                await (handler as Gland.GlandMiddleware)(ctx, next);
              } else if (handler.length === 3) {
                await new Promise<void>((resolve, reject) => {
                  (handler as Gland.ExpressMiddleware)(ctx.rq, ctx.rs, (err?: any) => {
                    if (err) reject(err);
                    else resolve();
                  });
                });
              } else {
                throw new Error('Invalid middleware/handler function signature');
              }
            } else {
              await next();
            }
          });
        } else if (handler.length === 1) {
          middlewares.push(handler as Gland.GlandMiddleware);
        } else {
          throw new Error('Invalid middleware/handler function signature');
        }
      });
    } else {
      // Handle when path is not a string
      const allMiddlewares = [path, ...handlers].flat();
      const uniqueMiddlewares = Array.from(new Set(allMiddlewares));
      middlewares.push(...uniqueMiddlewares);
    }
  }
}
