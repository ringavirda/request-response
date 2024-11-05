import { ComponentBase, loadComponent } from "@client/components/components";
import { CharacterList } from "@client/components/page-chars/characters/characterList";
import { Polling } from "@client/components/page-pols/polling/polling";
import { injectable } from "tsyringe";
import { constructor } from "tsyringe/dist/typings/types";

interface Route {
  path: string;
  component: unknown;
}

@injectable()
export class AppRouter {
  private _appRoot: string = "app-root";
  private _anchor: HTMLDivElement;

  private readonly _routes: Array<Route> = [
    {
      path: "/",
      component: CharacterList,
    },
    {
      path: "/chars",
      component: CharacterList,
    },
    {
      path: "/pols",
      component: Polling,
    },
  ];

  constructor() {
    const root = document.querySelector<HTMLDivElement>(this._appRoot);
    if (root === null) throw new Error("App-root uninitialized.");
    this._anchor = root;
  }

  public async changeLocation(target?: string) {
    const path = target ?? window.location.pathname;
    const route = this._routes.find(
      (r) => r.path == path || `${r.path}/` == path,
    );
    if (route !== undefined) {
      this._anchor.innerHTML = "";
      await loadComponent(
        this._anchor,
        route.component as constructor<ComponentBase>,
      );
    } else {
      // Add 404 page.
    }
  }

  public getOtherRoutes(route: string) {
    return [...this._routes].map((r) => r.path).filter((r) => r !== route);
  }
}
