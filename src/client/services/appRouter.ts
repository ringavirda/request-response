import { ComponentBase, loadComponent } from "@client/components/components";
import { singleton } from "tsyringe";
import { constructor } from "tsyringe/dist/typings/types";

export interface Route {
  path: string;
  component: unknown;
}

type RouterEventCallback = (path: string, model?: any) => void;
type RouterEvents = "route";

@singleton()
export class Router {
  private _anchors: Map<HTMLElement, Array<Route>> = new Map();
  private _eventHandlers: Map<string, Array<RouterEventCallback>> = new Map();

  constructor() {
    window.onhashchange = () => this.changeLocation();
    this._eventHandlers.set("route", []);
  }

  public registerAnchor(anchor: HTMLElement, routes: Array<Route>) {
    if (this._anchors.has(anchor))
      throw new Error(`Router: attempted reassign of anchor [${anchor}].`);
    this._anchors.set(anchor, routes);
  }

  public async changeLocation(target?: string) {
    const path = target ?? window.location.pathname;

    const anchorRoute = this._anchors
      .entries()
      .find((a) => a[1].find((r) => r.path == path) !== undefined);

    if (anchorRoute !== undefined) {
      const anchor = anchorRoute[0];
      anchor.innerHTML = "";
      const route = anchorRoute[1].find((r) => r.path == path);

      this.emit("route", path);
      await loadComponent(
        anchor,
        route?.component as constructor<ComponentBase>,
      );
    } else {
      throw new Error(`Unknown route: [${target}]`);
    }
  }

  public on(name: RouterEvents, callback: RouterEventCallback) {
    this._eventHandlers.get(name)?.push(callback);
  }

  private emit(name: RouterEvents, model: any) {
    if (name === "route") {
      this._eventHandlers.get("route")?.forEach((handler) => handler(model));
    }
  }
}
