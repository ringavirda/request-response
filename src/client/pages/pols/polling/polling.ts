import "./polling.scss";
import template from "./polling.html";

import { component, ComponentBase } from "@client/framework/components";

@component("polling", template, true)
export class Polling extends ComponentBase {
  constructor() {
    super(Polling);
  }

  public override async initialize(): Promise<void> {}
}
