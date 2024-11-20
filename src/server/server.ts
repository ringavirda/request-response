import "reflect-metadata";

import express from "express";
import { Server } from "socket.io";
import { access, constants } from "fs/promises";
import { resolve } from "path";

import { clientRoutes, commonPort, serverListeningHost } from "@common/routes";
import { loggingMiddleware } from "./middleware/logging";
import { corsMiddleware } from "./middleware/cors";
import {
  errorHandlingMiddleware,
  notFoundMiddleware,
} from "./middleware/errors";
import { CharactersController } from "./controllers/characters";
import { DefaultController } from "./controllers/default";
import { logger, useControllerRoutes } from "./framework";
import { PollingController } from "./controllers/polling";
import { MapSerializationFixes } from "@common/fixes";

export const serverHostname = serverListeningHost;
export const serverPort = commonPort;
export const serverAllowedMethods = ["get", "post", "put", "delete"];
export const preloadFlag = "--preload";

logger.info("Server", "Startup begin.");

const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(
  express.json({
    reviver: MapSerializationFixes.reviver,
  }),
);

server.use(corsMiddleware);
server.use(loggingMiddleware);

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

useControllerRoutes(DefaultController, server);
DefaultController.preloadPrincess();
useControllerRoutes(CharactersController, server);
useControllerRoutes(PollingController, server);

server.use(errorHandlingMiddleware);
server.use(notFoundMiddleware);

const running = server.listen(serverPort);
logger.info(
  "Server",
  `Startup finished, listening on:\nhttp://${serverHostname}:${serverPort}`,
);

if (process.argv.includes(preloadFlag)) {
  logger.info(
    "Server",
    `${preloadFlag} was passed, starting to preload media...`,
  );
  await CharactersController.preloadAndPreprocessMedia();
}

const io = new Server(running);

io.on("connection", (socket) => {
  socket.on("pols-change", (json: string) => {
    socket.broadcast.emit("pols-update", json);
  });
});
