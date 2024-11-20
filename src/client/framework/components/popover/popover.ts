import "./popover.scss";

import { constructor } from "tsyringe/dist/typings/types";
import { component, ComponentBase, loadComponent } from "../../components";

const template = [
  "<popover>",
  "<div class='pop-component'></div>",
  "</popover>",
].join("\n");

@component("popover", template, true)
export class PopoverWrapper extends ComponentBase {
  constructor() {
    super(PopoverWrapper);
  }

  public async initialize(anchor?: HTMLElement, model?: any): Promise<void> {
    const type = this.modelIsDefined<constructor<ComponentBase>>(model);
    const renderer = this.getElement(".pop-component");
    loadComponent(renderer, type);
  }
}
