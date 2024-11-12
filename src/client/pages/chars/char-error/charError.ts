import "./char.error.scss";
import template from "./char.error.html";

import { component, ComponentBase } from "@client/framework/components";

@component("char-error", template, true)
export class CharError extends ComponentBase {
  private _messageElement: HTMLDivElement;

  constructor() {
    super(CharError);

    this._messageElement = this.getElement(".err-message");
  }

  public override async initialize(
    anchor?: HTMLDivElement,
    model?: Error,
  ): Promise<void> {
    model = this.modelIsDefined(model);

    this._messageElement.textContent = model.message;
  }
}
