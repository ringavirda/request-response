import { Request, Response, NextFunction } from "express";

import { logger } from "@server/framework";

const allowedStatusCodes = [200, 204, 304];

export const loggingMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  response.on("finish", () => {
    if (!allowedStatusCodes.includes(response.statusCode)) {
      logger.warn(
        "Request",
        `[${request.method}] to ${request.url} from ${request.socket.remoteAddress} returned with bad status (${response.statusCode}).`,
      );
    }
  });
  return next();
};
