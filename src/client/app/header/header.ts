import "./header.scss";
import template from "./header.html";

import { inject } from "tsyringe";

import { Router } from "@client/framework/routing";
import { component, ComponentBase } from "@client/framework/components";
import { ICharsApi } from "@client/services/charsApi";

@component("app-header", template)
export class AppHeader extends ComponentBase {
  private _waifuListElement: HTMLDivElement;
  private _titleElement: HTMLAnchorElement;

  constructor(
    @inject("ICharsApi") private readonly _api: ICharsApi,
    private readonly _router: Router,
  ) {
    super(AppHeader);

    this._waifuListElement = this.getElement(".waifu-list");
    this._titleElement = this.getElement(".title");
  }

  public override async initialize(): Promise<void> {
    const waifuList = await this._api.fetchCharacterList();
    this._waifuListElement.textContent = waifuList.join(", ");

    this._titleElement.addEventListener("click", (e) => {
      e.preventDefault();
      window.history.pushState({}, "", (e.target as HTMLAnchorElement).href);
      this._router.changeLocation((e.target as HTMLAnchorElement).pathname);
    });
  }
}
