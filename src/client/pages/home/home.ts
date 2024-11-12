import { component, ComponentBase } from "@client/framework/components";
import { HomeCard } from "./card/homeCard";
import { HomePrincess } from "./princess/homePrincess";

const template = [
  "<home-card></home-card>",
  "<home-princess></home-princess>",
].join("\n");

@component("home-page", template)
export class HomePage extends ComponentBase {
  constructor() {
    super(HomePage);
  }

  public override async initialize(): Promise<void> {
    if (this._element.innerHTML === "\n")
      this._element.innerHTML = this._template;

    this.loadComponent(HomeCard);
    this.loadComponent(HomePrincess);
  }
}
