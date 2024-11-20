import "./pols.scss";

import { component, ComponentBase, loadComponent } from "@client/framework";
import { PolWaifu } from "./pol-waifu/polWaifu";
import { PolsApi } from "@client/services/polsApi";
import { WaifuPol } from "@common/models";
import { PolsValues } from "@client/services/polsValues";

const template = ["<div class='pols-wrapper'></div>"].join("\n");

@component("pols-page", template)
export class PolsPage extends ComponentBase {
  private _polsWrapperElement: HTMLDivElement;

  constructor(
    private readonly _api: PolsApi,
    private readonly _values: PolsValues,
  ) {
    super(PolsPage);

    this._polsWrapperElement = this.getElement<HTMLDivElement>(".pols-wrapper");
  }

  public accessor Pols: Array<WaifuPol> = null!;

  public override async initialize(): Promise<void> {
    if (this._element.innerHTML == "\n" || this._element.innerHTML === "")
      this._element.innerHTML = this._template;

    await this.reloadPols();
  }

  public async reloadPols(): Promise<void> {
    this.Pols = await this._api.fetchAllPols();
    await this._values.registerPols(this.Pols);
    this._polsWrapperElement.innerHTML = "";

    if (this.Pols.length === 0) {
      this._polsWrapperElement.classList.add("no-pols");
      this._polsWrapperElement.textContent = "There aren't any pols yet!";
    } else {
      this.Pols.forEach(async (pol) => {
        await loadComponent(this._polsWrapperElement, PolWaifu, pol);
      });
      this.Pols.forEach((pol) => this._values.emit("changed", pol));
    }
  }
}
