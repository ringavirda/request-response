import "./footer.scss";
import template from "./footer.html";
import badge from "../../assets/fallen_badge.png";

import { component, ComponentBase } from "@client/framework/components";

@component("app-footer", template)
export class AppFooter extends ComponentBase {
  private _badgeElement: HTMLImageElement;

  constructor() {
    super(AppFooter);

    this._badgeElement = this.getElement(".badge");
  }

  public override async initialize(): Promise<void> {
    this._badgeElement.src = badge;
  }
}
