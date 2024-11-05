import "reflect-metadata";
import "./styles.scss";

import { container } from "tsyringe";
import { AppRouter } from "./services/appRouter";
import { loadComponent } from "./components/components";
import { AppHeader } from "./components/app-header/header";
import { AppNav } from "./components/app-navigation/navigation";
import { AppFooter } from "./components/app-footer/footer";

const headerElement = document.querySelector<HTMLDivElement>("app-header");
const navElement = document.querySelector<HTMLDivElement>("app-nav");
const footerElement = document.querySelector<HTMLDivElement>("app-footer");

await loadComponent(headerElement, AppHeader);
await loadComponent(navElement, AppNav);

const path = window.location.pathname;
container.resolve(AppRouter).changeLocation(path);

await loadComponent(footerElement, AppFooter);
