import "./polling.scss";
import template from "./polling.html";

import { injectable } from "tsyringe";
import { ComponentBase } from "@client/components/components";

@injectable()
export class Polling extends ComponentBase {
  constructor() {
    super(template);
  }

  public override async initialize(): Promise<void> {}
}
