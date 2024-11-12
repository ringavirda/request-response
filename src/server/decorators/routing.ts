import logger from "@server/services/logger";
import { Express, RequestHandler } from "express";
import { container } from "tsyringe";

export type RouteAllowedMethods = "get" | "post" | "put" | "delete";
export type RouteHandlersMap = Map<
  RouteAllowedMethods,
  Map<string, Array<RequestHandler>>
>;

export function controller<T extends typeof Object.prototype>(
  controllerRoute: string = "/api",
) {
  return function (constructor: T) {
    Reflect.defineMetadata("controllerRoute", controllerRoute, constructor);
  };
}

export function route(
  method: RouteAllowedMethods,
  path: string = "",
  ...middleware: Array<RequestHandler>
) {
  return function (target: object, key: string, desc: PropertyDescriptor) {
    const routeHandlers: RouteHandlersMap =
      Reflect.getMetadata("routeHandlers", target) ?? new Map();
    if (!routeHandlers.has(method)) routeHandlers.set(method, new Map());

    routeHandlers
      .get(method)
      ?.set(path, [...middleware, desc.value as RequestHandler]);

    Reflect.defineMetadata("routeHandlers", routeHandlers, target);
  };
}

export function useControllerRoutes<T extends typeof Object>(
  controllers: Array<T>,
  server: Express,
) {
  for (const ctr of controllers) {
    const controller = new ctr();
    const routeHandlers: RouteHandlersMap = Reflect.getMetadata(
      "routeHandlers",
      controller,
    );
    let controllerPath = Reflect.getMetadata(
      "controllerRoute",
      controller.constructor,
    );
    controllerPath = controllerPath === "/" ? "" : controllerPath;
    const methods = Array.from(routeHandlers.keys());
    methods.forEach((method) => {
      const routes = routeHandlers.get(method);
      if (routes !== undefined) {
        const routePaths = Array.from(routes.keys());
        routePaths.forEach((path) => {
          const routePath = path === "/" ? "" : path;
          const handlers = routes.get(path);
          if (handlers !== undefined) {
            const context = container.resolve(ctr);
            handlers.forEach((handler) => {
              server[method](controllerPath + routePath, handler.bind(context));
            });
            logger.info(
              "Server",
              `Registered new server route: [${method}] ${controllerPath + routePath}`,
            );
          }
        });
      }
    });
  }
}
