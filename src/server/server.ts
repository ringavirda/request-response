import "reflect-metadata";
import express from "express";
import { access, constants } from "fs/promises";
import { resolve } from "path";
import { container } from "tsyringe";
import { Logger } from "./services/logger";
import { clientRoutes } from "@wp/common/routes";

const server = express();

const hostname = "localhost";
const port = 5000;
const staticPath = resolve(__dirname, "public");

const logger = container.resolve(Logger);
logger.info("Server", "Startup begin.");

// Middleware loading.

try {
  await access(staticPath, constants.F_OK);
  clientRoutes.forEach((r) => server.use(r, express.static(staticPath)));
  logger.info("Server", `Client routes loaded [${clientRoutes.join(", ")}]`);
} catch {
  logger.warn(
    "Server",
    "No `public` folder was found. Running in pure API mode.",
  );
}

// Server start.

server.listen(port);
logger.info(
  "Server",
  `Startup finished, listening on:\nhttp://${hostname}:${port}`,
);
