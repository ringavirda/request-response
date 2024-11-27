import "./char.error.scss";
import template from "./char.error.html";

import { component, ComponentBase } from "@client/framework";

@component("char-error", template, true)
export class CharError extends ComponentBase {
  constructor() {
    super(CharError);
  }

  public override async initialize(
    anchor?: HTMLDivElement,
    model?: Error,
  ): Promise<void> {
    model = this.modelIsDefined(model);

    this.getElement(".err-message").textContent = model.message;
  }
}
