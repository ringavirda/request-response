import "./footer.scss";
import template from "./footer.html";
import badge from "../../assets/fallen_badge.png";

import { singleton } from "tsyringe";
import { ComponentBase } from "../components";

@singleton()
export class AppFooter extends ComponentBase {
  private _badgeElement: HTMLImageElement;

  constructor() {
    super(template);

    this._badgeElement = this.getElement(".badge");
  }

  public override async initialize(): Promise<void> {
    this._badgeElement.src = badge;
  }
}
