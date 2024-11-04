import express from "express";
import { access, constants } from "fs/promises";
import { resolve } from "path";

const server = express();

const port = 5000;
const staticPath = resolve(__dirname, "public");

try {
  await access(staticPath, constants.F_OK);
  server.use("/", express.static(staticPath));
  server.use("/chars", express.static(staticPath));
  server.use("/pols", express.static(staticPath));
} catch {
  console.log("No `public` folder was found. Running in pure API mode.");
}

server.listen(port);
console.log("Server Started");
