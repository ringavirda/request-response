import "./polling.scss";
import template from "./polling.html";
import { injectable } from "tsyringe";
import { ComponentBase } from "@common/components";

@injectable()
export class Polling extends ComponentBase {
  private _helloElement: HTMLDivElement;

  constructor() {
    super(template);

    this._helloElement = this.getElement(".hello");
  }

  public override async initialize(): Promise<void> {
    this._helloElement.textContent = "Hello from TS!";
  }
}
