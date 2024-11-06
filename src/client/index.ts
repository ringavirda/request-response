import "reflect-metadata";
import "./styles.scss";

import { container } from "tsyringe";
import { Router, Route } from "./services/appRouter";
import { loadComponent } from "./components/components";
import { AppHeader } from "./components/app-header/header";
import { AppNav } from "./components/app-navigation/navigation";
import { AppFooter } from "./components/app-footer/footer";
import { CharacterList } from "./components/page-chars/character-list/characterList";
import { Polling } from "./components/page-pols/polling/polling";
import { clientRoutes } from "@wp/common/routes";
import { CharsApi, ICharsApi } from "./services/charsApi";

container.register<ICharsApi>("ICharsApi", CharsApi);

const rootRoutes = clientRoutes
  .map((r) => {
    if (r === "/") return { path: r, component: CharacterList } as Route;
    if (r === "/chars") return { path: r, component: CharacterList } as Route;
    if (r === "/pols") return { path: r, component: Polling } as Route;
  })
  .filter((r) => r !== undefined);

const headerElement = document.querySelector<HTMLDivElement>("app-header");
const navElement = document.querySelector<HTMLDivElement>("app-nav");
const rootElement = document.querySelector<HTMLDivElement>("app-root");
const footerElement = document.querySelector<HTMLDivElement>("app-footer");

await loadComponent(headerElement, AppHeader);
await loadComponent(navElement, AppNav);

const path = window.location.pathname;
const rootRouter = container.resolve(Router);

rootRouter.registerAnchor(rootElement, rootRoutes);
rootRouter.changeLocation(path);

await loadComponent(footerElement, AppFooter);
