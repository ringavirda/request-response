import "./app.scss";

import { container } from "tsyringe";

import {
  component,
  ComponentBase,
  loadComponent,
} from "@client/framework/components";
import { Route, Router } from "@client/framework/routing";
import { CharsApi, ICharsApi } from "@client/services/charsApi";
import { clientRoutes } from "@common/routes";
import { AppHeader } from "./header/header";
import { AppNav } from "./nav/nav";
import { AppFooter } from "./footer/footer";
import { CharsPage } from "@client/pages/chars/chars";
import { PolsPage } from "@client/pages/pols/pols";
import { LoadingSpinner } from "./loading";
import { HomePage } from "@client/pages/home/home";

const rootSelector = "app-root";
const pageRouter = "page-router";

const template = [
  "<app-header></app-header>",
  "<app-nav></app-nav>",
  "<page-router></page-router>",
  "<app-footer></app-footer>",
].join("\n");

@component(rootSelector, template)
export class App extends ComponentBase {
  constructor(private readonly _appRouter: Router) {
    super(App);

    container.register<ICharsApi>("ICharsApi", CharsApi);
  }

  public async initialize(): Promise<void> {
    await this.loadComponent(AppHeader);
    await this.loadComponent(AppNav);
    await this.loadComponent(AppFooter);

    const appRoutes: Array<Route> = clientRoutes
      .map((r) => {
        if (r === "/") return { path: r, component: HomePage };
        if (r === "/chars") return { path: r, component: CharsPage };
        if (r === "/pols") return { path: r, component: PolsPage };
      })
      .filter((r) => r !== undefined);
    const path = window.location.pathname;
    const routerElement = this.getElement(pageRouter);
    this._appRouter.registerAnchor(routerElement, appRoutes);
    await this._appRouter.changeLocation(path);
  }

  public async bind() {
    const rootElement = document.querySelector<HTMLElement>(rootSelector);
    if (rootElement === null)
      throw new Error(
        `Root tag wasn't found - app bounding failed. Should be: ${rootSelector}`,
      );
    await loadComponent(rootElement, LoadingSpinner);
    await loadComponent(rootElement, App, null, true);
  }
}
