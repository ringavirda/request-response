import { ComponentBase, component } from "@client/framework";

import { CharsList } from "./list/charsList";
import { CharsControls } from "./controls/charsControls";

const template = [
  "<chars-controls></chars-controls>",
  "<chars-list></chars-list>",
].join("\n");

export type CharsModel = {
  default: Array<string>;
  loadCallback?: (waifus: Array<string>) => Promise<void>;
};

@component("chars-page", template)
export class CharsPage extends ComponentBase {
  private _defaultWaifus = ["keqing", "kokomi", "nilou", "chiori"];

  constructor() {
    super(CharsPage);
  }

  public override async initialize(): Promise<void> {
    const model = {
      default: this._defaultWaifus,
    } as CharsModel;

    if (this._element.innerHTML == "\n")
      this._element.innerHTML = this._template;
    const charList = await this.loadComponent(CharsList, model);
    model.loadCallback = CharsList.prototype.loadWaifus.bind(charList);
    await this.loadComponent(CharsControls, model);
  }
}
