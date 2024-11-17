import { Request, Response, NextFunction } from "express";

import { logger } from "@server/framework";

export function notFoundMiddleware(
  req: Request,
  res: Response,
  // next: NextFunction,
) {
  const error = new Error(
    `The bottom of the middleware stack was reached. Returning with (404) code.`,
  );
  logger.error("Request", error.message);

  res.status(404).json({ error: error.message });
}

export function errorHandlingMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.xhr) {
    const errMessage = `A server error occurred! Reason: ${err.message}`;
    logger.error("Request", errMessage);
    res.status(500).json({ error: errMessage });
  } else {
    return next();
  }
}
