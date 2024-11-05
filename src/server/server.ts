import express from "express";
import { access, constants } from "fs/promises";
import { resolve } from "path";

const server = express();

const port = 5000;
const staticPath = resolve(__dirname, "public");
const clientRoutes = ["/", "/chars", "/pols"];

try {
  await access(staticPath, constants.F_OK);
  clientRoutes.forEach((r) => server.use(r, express.static(staticPath)));
} catch {
  console.log("No `public` folder was found. Running in pure API mode.");
}

server.listen(port);
