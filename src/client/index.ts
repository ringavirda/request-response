import "reflect-metadata";
import "./styles.scss";

import { AppHeader } from "./components/header/header";
import { loadComponent } from "@common/components";
import { Characters } from "./components/characters/characters";
import { AppFooter } from "./components/footer/footer";

const headerElement = document.querySelector<HTMLDivElement>("app-header");
const rootElement = document.querySelector<HTMLDivElement>("app-root");
const footerElement = document.querySelector<HTMLDivElement>("app-footer");

loadComponent(headerElement, AppHeader);
loadComponent(rootElement, Characters);
loadComponent(footerElement, AppFooter);
