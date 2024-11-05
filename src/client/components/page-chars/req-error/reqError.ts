import "./req_error.scss";
import template from "./req_error.html";
import { injectable } from "tsyringe";
import { ComponentBase } from "@client/components/components";

@injectable()
export class RequestError extends ComponentBase {
  private _messageElement: HTMLDivElement;

  constructor() {
    super(template);

    this._messageElement = this.getElement(".err-message");
  }

  public override async initialize(
    anchor?: HTMLDivElement,
    model?: Error,
  ): Promise<void> {
    model = this.validateModel(model);
    this._messageElement.textContent = model.message;
  }
}
