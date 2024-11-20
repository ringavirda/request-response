import "./nav.scss";
import template from "./nav.html";

import { container } from "tsyringe";

import { component, ComponentBase, Router } from "@client/framework";
import {
  CharsApi,
  CharsGenshinApi,
  ICharsApi,
} from "@client/services/charsApi";
import { PolCreate } from "@client/pages/pols/pol-create/polCreate";

const charsLoaderKey: string = "chars-loader";

@component("app-nav", template)
export class AppNav extends ComponentBase {
  private _toCharactersElement: HTMLAnchorElement;
  private _toPolsElement: HTMLAnchorElement;

  private _serverLoadSelectElement: HTMLDivElement;
  private _genshinLoadSelectElement: HTMLDivElement;
  private _polCreateElement: HTMLDivElement;

  constructor(private readonly _router: Router) {
    super(AppNav);

    this._toCharactersElement = this.getElement("[id='chars']");
    this._toPolsElement = this.getElement("[id='pols']");
    this._serverLoadSelectElement = this.getElement("[id='server-load']");
    this._genshinLoadSelectElement = this.getElement("[id='genshin-load']");
    this._polCreateElement = this.getElement("[id='pol-create']");

    _router.restrictVisibility(this.getElement(".nav-load-select"), [
      "/chars",
      "/chars/",
    ]);
    _router.restrictVisibility(this.getElement(".nav-pol-create"), [
      "/pols",
      "/pols/",
    ]);
  }

  public override async initialize(): Promise<void> {
    this._toCharactersElement.addEventListener("click", (e) =>
      this.onNavigationRoute(e, this._router),
    );
    this._toPolsElement.addEventListener("click", (e) =>
      this.onNavigationRoute(e, this._router),
    );

    this._router.on("route", (path) => {
      if (path === "/chars" || path === "/chars/") {
        this._toCharactersElement.classList.add("selected");
        this._toPolsElement.classList.remove("selected");
      } else if (path === "/pols" || path === "/pols/") {
        this._toPolsElement.classList.add("selected");
        this._toCharactersElement.classList.remove("selected");
      } else {
        this._toPolsElement.classList.remove("selected");
        this._toCharactersElement.classList.remove("selected");
      }
    });

    this._serverLoadSelectElement.addEventListener("click", (e) =>
      this.onChangeLoader(e),
    );
    this._genshinLoadSelectElement.addEventListener("click", (e) =>
      this.onChangeLoader(e),
    );

    let saved = window.sessionStorage.getItem(charsLoaderKey);
    if (saved == null) saved = "server-load";
    if (saved === "genshin-load")
      this._genshinLoadSelectElement.dispatchEvent(new Event("click"));
    else this._serverLoadSelectElement.dispatchEvent(new Event("click"));

    this._polCreateElement.addEventListener("click", () =>
      this._router.displayPopover(PolCreate),
    );
  }

  private onNavigationRoute(e: MouseEvent, router?: Router): void {
    e.preventDefault();
    window.history.pushState({}, "", (e.target as HTMLAnchorElement).href);
    const path = (e.target as HTMLAnchorElement).pathname;
    router?.changeLocation(path);
    if (document.activeElement instanceof HTMLElement)
      document.activeElement.blur();
  }

  private onChangeLoader(e: MouseEvent): void {
    const id = (e.target as HTMLDivElement).id;
    if (id === null)
      window.sessionStorage.setItem(charsLoaderKey, "server-load");
    if (id === "server-load") {
      this._serverLoadSelectElement.classList.add("selected-load");
      this._genshinLoadSelectElement.classList.remove("selected-load");
      container.register<ICharsApi>("ICharsApi", CharsApi);
    } else if (id === "genshin-load") {
      this._serverLoadSelectElement.classList.remove("selected-load");
      this._genshinLoadSelectElement.classList.add("selected-load");
      container.register<ICharsApi>("ICharsApi", CharsGenshinApi);
    }
    window.sessionStorage.setItem(charsLoaderKey, id);
  }
}
