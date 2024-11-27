import "./home.card.scss";
import template from "./home.card.html";

import { component, ComponentBase } from "@client/framework";

@component("home-card", template, true)
export class HomeCard extends ComponentBase {
  constructor() {
    super(HomeCard);
  }

  public override async initialize(): Promise<void> {}
}
