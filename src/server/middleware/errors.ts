import logger from "@server/services/logger";
import { Request, Response, NextFunction } from "express";

export const notFoundMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const error = new Error(
    `The bottom of the middleware stack was reached. Returning with (404) code.`,
  );
  logger.error("Request", error.message);

  return response.status(404).json({ error: error.message });
};

export const errorHandlingMiddleware = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const err = new Error(
    `Oh no, something is broken on the server side! Error description: ${error.message}`,
  );
  logger.error("Request", err.message);

  return response.status(500).json({ error: error.message });
};
