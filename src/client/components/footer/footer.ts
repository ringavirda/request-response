import "./footer.scss";
import template from "./footer.html";
import { ComponentBase } from "@common/components";
import badge from "../../assets/badge.png";
import { singleton } from "tsyringe";

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
