import { component, ComponentBase } from "@client/framework";

const template = ["<app-loading></app-loading>"].join("\n");

@component("app-loading", template)
export class LoadingSpinner extends ComponentBase {
  constructor() {
    super(LoadingSpinner);
  }

  public override async initialize(): Promise<void> {}
}
