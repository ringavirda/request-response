import logger from "@server/services/logger";
import { Express, RequestHandler } from "express";

export type RouteAllowedMethods = "get" | "post" | "put" | "delete";
export type RouteHandlersMap = Map<
  RouteAllowedMethods,
  Map<string, RequestHandler>
>;

export const controller = (controllerRoute: string = "/api") => {
  return (constructor: Function) => {
    Reflect.defineMetadata("controllerRoute", controllerRoute, constructor);
  };
};

export const route = (
  method: RouteAllowedMethods,
  path: string = "",
  ...middleware: Array<RequestHandler>
) => {
  return (target: any, key: string, desc: PropertyDescriptor) => {
    const routeHandlers: RouteHandlersMap =
      Reflect.getMetadata("routeHandlers", target) ?? new Map();
    if (!routeHandlers.has(method)) routeHandlers.set(method, new Map());

    routeHandlers.get(method)?.set(path, [...middleware, desc.value] as any);

    Reflect.defineMetadata("routeHandlers", routeHandlers, target);
  };
};

export const useControllerRoutes = (controllers: any, server: Express) => {
  for (const ctr of controllers) {
    const controller = new ctr();
    const routeHandlers: RouteHandlersMap = Reflect.getMetadata(
      "routeHandlers",
      controller,
    );
    const controllerPath = Reflect.getMetadata(
      "controllerRoute",
      controller.constructor,
    );
    const methods = Array.from(routeHandlers.keys());
    methods.forEach((method) => {
      const routes = routeHandlers.get(method);
      if (routes !== undefined) {
        const routePaths = Array.from(routes.keys());
        routePaths.forEach((path) => {
          const handlers = routes.get(path);

          server[method](controllerPath + path, handlers as any);
          logger.info(
            "Server",
            `Registered new server route: [${method}] ${controllerPath + path}`,
          );
        });
      }
    });
  }
};
