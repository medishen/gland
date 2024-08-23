import { ServerUtils } from '../../helper';
import Reflect from '../../metadata/metadata';
import { MidsFn } from '../../types/types';
const classes: Set<any> = new Set();
function exposed(t?: any): any {
  const attach = (target: any = t) => {
    classes.add(target);
  };
  if (typeof t === 'function') {
    // Used as a decorator
    attach();
    return t;
  } else if (t) {
    // Used as a function
    const classesToExpose = Array.isArray(t) ? t : [t];
    classesToExpose.forEach(attach);
  } else {
    // Fallback for when expose is called with no arguments
    return function (target: any) {
      attach(target);
    };
  }
}
function getEx(): any[] {
  return Array.from(classes);
}
export { exposed, getEx };
export function mid(middleware: MidsFn | MidsFn[]): MethodDecorator | any {
  return (target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor): void => {
    const existingMids = Reflect.get('middlewares', target.constructor.prototype, propertyKey) || [];
    const newMids = ServerUtils.normalize(middleware);
    Reflect.init('middlewares', [...existingMids, ...newMids], target.constructor.prototype, propertyKey);
  };
}

export function mids(middlewareArray: MidsFn[] | MidsFn): ClassDecorator {
  return (target: any) => {
    const newMids = ServerUtils.normalize(middlewareArray);
    Reflect.init('classMiddlewares', newMids, target.prototype);
  };
}