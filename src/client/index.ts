import "reflect-metadata";
import "./styles.scss";

import { container } from "tsyringe";
import { App } from "./app/app";

const app = container.resolve(App);
await app.bind();
