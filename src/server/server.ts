import "reflect-metadata";
import express from "express";
import { access, constants } from "fs/promises";
import { resolve } from "path";
import logger from "./services/logger";
import { clientRoutes } from "@common/routes";
import { loggingMiddleware } from "./middleware/logging";
import { corsMiddleware } from "./middleware/cors";
import {
  errorHandlingMiddleware,
  notFoundMiddleware,
} from "./middleware/errors";
import { useControllerRoutes } from "./decorators/routing";
import { CharactersController } from "./controllers/characters";
import { DefaultController } from "./controllers/default";
import { preloadAndPreprocessCharacterMedia } from "./services/genshinApi";

export const serverHostname = "localhost";
export const serverPort = 5000;
export const serverAllowedMethods = ["get", "post", "put", "delete"];

logger.info("Server", "Startup begin.");

const server = express();
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

// Middleware loading.

server.use(loggingMiddleware as any);
server.use(errorHandlingMiddleware as any);
server.use(corsMiddleware as any);

try {
  const staticPath = resolve(__dirname, "public");
  await access(staticPath, constants.F_OK);
  clientRoutes.forEach((r) => server.use(r, express.static(staticPath)));
  logger.info("Server", `Client routes loaded: [ ${clientRoutes.join(", ")} ]`);
} catch {
  logger.warn(
    "Server",
    "No `public` folder was found. Running in pure API mode.",
  );
}

useControllerRoutes([DefaultController, CharactersController], server);

// Default error middleware.

server.use(notFoundMiddleware as any);

// Server start.

server.listen(serverPort);
logger.info(
  "Server",
  `Startup finished, listening on:\nhttp://${serverHostname}:${serverPort}`,
);

// Start preloading.
preloadAndPreprocessCharacterMedia();
