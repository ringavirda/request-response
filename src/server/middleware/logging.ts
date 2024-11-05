import logger from "@server/services/logger";
import { Request, Response, NextFunction } from "express";

const allowedStatusCodes = [200, 204];

export const loggingMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  response.on("finish", () => {
    if (!allowedStatusCodes.includes(response.statusCode)) {
      logger.warn(
        "Request",
        `[${request.method}] to ${request.url} from ${request.socket.remoteAddress} with bad status (${response.statusCode}).`,
      );
    }
  });

  next();
};
