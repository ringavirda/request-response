import "./navigation.scss";
import template from "./navigation.html";

import { singleton } from "tsyringe";
import { Router } from "@client/services/appRouter";
import { ComponentBase } from "../components";

@singleton()
export class AppNav extends ComponentBase {
  private _toCharacters: HTMLAnchorElement;
  private _toPols: HTMLAnchorElement;

  constructor(private readonly _router: Router) {
    super(template);

    this._toCharacters = this.getElement("[id='chars']");
    this._toPols = this.getElement("[id='pols']");
  }

  public override async initialize(): Promise<void> {
    this._toCharacters.addEventListener("click", (e) =>
      this.onRoute(e, this._router),
    );
    this._toPols.addEventListener("click", (e) =>
      this.onRoute(e, this._router),
    );
    this._router.on("route", (path) => {
      if (path === "/chars" || path === "/") {
        this._toCharacters.classList.add("selected");
        this._toPols.classList.remove("selected");
      } else if (path === "/pols") {
        this._toPols.classList.add("selected");
        this._toCharacters.classList.remove("selected");
      } else {
        this._toPols.classList.remove("selected");
        this._toCharacters.classList.remove("selected");
      }
    });
  }

  private onRoute(ev: MouseEvent, router?: Router): void {
    ev.preventDefault();
    window.history.pushState({}, "", (ev.target as HTMLAnchorElement).href);
    let path = (ev.target as HTMLAnchorElement).pathname;
    path = path === "/" ? "/chars" : path;
    router?.changeLocation(path);
  }
}
