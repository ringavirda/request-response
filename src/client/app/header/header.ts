import "./header.scss";
import template from "./header.html";

import { inject } from "tsyringe";

import { component, ComponentBase, Router } from "@client/framework";
import { ICharsApi } from "@client/services/charsApi";

@component("app-header", template)
export class AppHeader extends ComponentBase {
  constructor(
    @inject("ICharsApi") private readonly _api: ICharsApi,
    private readonly _router: Router,
  ) {
    super(AppHeader);
  }

  public override async initialize(): Promise<void> {
    const waifuList = await this._api.fetchCharacterList();
    this.getElement(".waifu-list").textContent = waifuList.join(", ");

    this.getElement(".title").addEventListener("click", (e) => {
      e.preventDefault();
      window.history.pushState({}, "", (e.target as HTMLAnchorElement).href);
      this._router.changeLocation((e.target as HTMLAnchorElement).pathname);
    });
  }
}
