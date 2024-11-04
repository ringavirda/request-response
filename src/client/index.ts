import "reflect-metadata";
import "./styles.scss";

import { loadComponent } from "@common/components";
import { AppHeader } from "./components/header/header";
import { AppFooter } from "./components/footer/footer";
import { AppNav } from "./components/navigation/navigation";
import { container } from "tsyringe";
import { AppRouter } from "./services/appRouter";

const headerElement = document.querySelector<HTMLDivElement>("app-header");
const navElement = document.querySelector<HTMLDivElement>("app-nav");
const footerElement = document.querySelector<HTMLDivElement>("app-footer");

await loadComponent(headerElement, AppHeader);
await loadComponent(navElement, AppNav);

const path = window.location.pathname;
container.resolve(AppRouter).changeLocation(path);

await loadComponent(footerElement, AppFooter);
