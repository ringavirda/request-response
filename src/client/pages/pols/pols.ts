import { component, ComponentBase } from "@client/framework/components";
import { Polling } from "./polling/polling";

const template = ["<polling></polling>"].join("\n");

@component("pols-page", template)
export class PolsPage extends ComponentBase {
  constructor() {
    super(PolsPage);
  }

  public override async initialize(): Promise<void> {
    if (this._element.innerHTML == "\n" || this._element.innerHTML === "")
      this._element.innerHTML = this._template;

    await this.loadComponent(Polling);
  }
}
