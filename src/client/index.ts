import "reflect-metadata";
import "./styles.scss";

import { container } from "tsyringe";
import { Router, Route } from "./services/appRouter";
import { loadComponent } from "./components/components";
import { AppHeader } from "./components/app-header/header";
import { AppNav } from "./components/app-navigation/navigation";
import { AppFooter } from "./components/app-footer/footer";
import { CharacterList } from "./components/page-chars/characters/characterList";
import { Polling } from "./components/page-pols/polling/polling";

const rootRoutes: Array<Route> = [
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

const headerElement = document.querySelector<HTMLDivElement>("app-header");
const navElement = document.querySelector<HTMLDivElement>("app-nav");
const footerElement = document.querySelector<HTMLDivElement>("app-footer");

await loadComponent(headerElement, AppHeader);
await loadComponent(navElement, AppNav);

const path = window.location.pathname;
const rootRouter = container.resolve(Router);
const rootElement = document.querySelector<HTMLDivElement>("app-root");
if (rootElement != null) {
  rootRouter.registerAnchor(rootElement, rootRoutes);
  rootRouter.changeLocation(path);
}

await loadComponent(footerElement, AppFooter);
