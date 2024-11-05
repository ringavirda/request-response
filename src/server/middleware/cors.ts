import { serverAllowedMethods } from "@server/server";
import { Request, Response, NextFunction } from "express";

export const corsMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  response.header("Access-Control-Allow-Origin", request.header("origin"));
  response.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );

  if (request.method == "OPTIONS") {
    response.header(
      "Access-Control-Allow-Methods",
      serverAllowedMethods.map((m) => m.toUpperCase()).join(", "),
    );
    return response.status(204).json({});
  }

  next();
};
