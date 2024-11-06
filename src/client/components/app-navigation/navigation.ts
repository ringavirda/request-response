import "./navigation.scss";
import template from "./navigation.html";

import { container, singleton } from "tsyringe";
import { Router } from "@client/services/appRouter";
import { ComponentBase } from "../components";
import {
  CharsApi,
  CharsGenshinApi,
  ICharsApi,
} from "@client/services/charsApi";

const charsLoaderKey: string = "chars-loader";

@singleton()
export class AppNav extends ComponentBase {
  private _toCharactersElement: HTMLAnchorElement;
  private _toPolsElement: HTMLAnchorElement;

  private _serverLoadSelectElement: HTMLDivElement;
  private _genshinLoadSelectElement: HTMLDivElement;

  constructor(private readonly _router: Router) {
    super(template);

    this._toCharactersElement = this.getElement("[id='chars']");
    this._toPolsElement = this.getElement("[id='pols']");
    this._serverLoadSelectElement = this.getElement("[id='server-load']");
    this._genshinLoadSelectElement = this.getElement("[id='genshin-load']");
  }

  public override async initialize(): Promise<void> {
    this._toCharactersElement.addEventListener("click", (e) =>
      this.onNavigationRoute(e, this._router),
    );
    this._toPolsElement.addEventListener("click", (e) =>
      this.onNavigationRoute(e, this._router),
    );

    this._router.on("route", (path) => {
      if (path === "/chars" || path === "/") {
        this._toCharactersElement.classList.add("selected");
        this._toPolsElement.classList.remove("selected");
      } else if (path === "/pols") {
        this._toPolsElement.classList.add("selected");
        this._toCharactersElement.classList.remove("selected");
      } else {
        this._toPolsElement.classList.remove("selected");
        this._toCharactersElement.classList.remove("selected");
      }
    });

    this._serverLoadSelectElement.addEventListener("click", (e) =>
      this.onChangeLoad(e),
    );
    this._genshinLoadSelectElement.addEventListener("click", (e) =>
      this.onChangeLoad(e),
    );

    let saved = window.sessionStorage.getItem(charsLoaderKey);
    if (saved == null) saved = "server-load";
    if (saved === "genshin-load")
      this._genshinLoadSelectElement.dispatchEvent(new Event("click"));
    else this._serverLoadSelectElement.dispatchEvent(new Event("click"));
  }

  private onNavigationRoute(e: MouseEvent, router?: Router): void {
    e.preventDefault();
    window.history.pushState({}, "", (e.target as HTMLAnchorElement).href);
    let path = (e.target as HTMLAnchorElement).pathname;
    path = path === "/" ? "/chars" : path;
    router?.changeLocation(path);
  }

  private onChangeLoad(e: MouseEvent): void {
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
