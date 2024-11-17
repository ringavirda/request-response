import "./footer.scss";
import template from "./footer.html";
import badge from "../../assets/fallen_badge.png";

import { component, ComponentBase } from "@client/framework";

@component("app-footer", template)
export class AppFooter extends ComponentBase {
  constructor() {
    super(AppFooter);
  }

  public override async initialize(): Promise<void> {
    this.getElement<HTMLImageElement>(".badge").src = badge;
  }
}
