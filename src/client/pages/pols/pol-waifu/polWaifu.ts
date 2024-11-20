import "./pol.waifu.scss";
import template from "./pol.waifu.html";

import {
  component,
  ComponentBase,
  fetchCurrentIp,
  loadComponent,
  toSha256String,
} from "@client/framework";
import { PolWaifuOption } from "../pol-waifu-option/polWaifuOption";
import { WaifuPol } from "@common/models";
import { PolsApi } from "@client/services/polsApi";
import { PolsValues } from "@client/services/polsValues";
import { PolsPage } from "../pols";
import { container } from "tsyringe";

export type PolWaifuOptionModel = {
  polTitle: string;
  charName: string;
  votes: number;
  value: number;
  pickCallback: (waifu: string) => Promise<void>;
};

@component("pol-waifu", template, true)
export class PolWaifu extends ComponentBase {
  private _polTitleElement: HTMLDivElement;
  private _polDescElement: HTMLDivElement;
  private _polOptionsElement: HTMLDivElement;

  private _polRetractElement: HTMLDivElement;

  private _polModel: WaifuPol = null!;

  constructor(
    private readonly _api: PolsApi,
    private readonly _values: PolsValues,
  ) {
    super(PolWaifu);

    this._polTitleElement = this.getElement(".pol-title");
    this._polDescElement = this.getElement(".pol-desc");
    this._polOptionsElement = this.getElement(".pol-options");

    this._polRetractElement = this.getElement(".pol-retract");
  }

  public override async initialize(
    anchor?: HTMLElement,
    model?: WaifuPol,
  ): Promise<void> {
    this._polModel = this.modelIsDefined(model);

    if (this._values.isAlreadyVoted(this._polModel.title))
      this._polRetractElement.classList.remove("pol-waifu-disabled");
    else this._polRetractElement.classList.add("pol-waifu-disabled");

    this._polRetractElement.addEventListener(
      "click",
      (async () => {
        const ipHash = await toSha256String(await fetchCurrentIp());
        for (const [option, votes] of this._polModel.options) {
          if (votes.find((vote) => vote === ipHash)) {
            this._values.decOptionValue(this._polModel.title, option);
          }
        }
      }).bind(this),
    );

    this.getElement(".pol-close").addEventListener(
      "click",
      (async () => {
        await this._api.fetchRemovePol(this._polModel);
        const page = container.resolve(PolsPage);
        await page.reloadPols();
      }).bind(this),
    );

    this._values.on(
      "changed",
      (async (pol: WaifuPol) => {
        if (pol.title === this._polModel.title) {
          await this._api.fetchUpdatePol(pol);
          this._polModel.options = pol.options;

          if (this._values.isAlreadyVoted(pol.title))
            this._polRetractElement.classList.remove("pol-waifu-disabled");
          else this._polRetractElement.classList.add("pol-waifu-disabled");

          this._values.emit("update", pol);
        }
      }).bind(this),
    );

    this._polTitleElement.textContent = this._polModel.title;
    if (this._polModel.description === undefined)
      this._polDescElement.style.display = "none";
    else this._polDescElement.textContent = this._polModel.description;

    for (const [option, options] of this._polModel.options.entries()) {
      await loadComponent(this._polOptionsElement, PolWaifuOption, {
        polTitle: this._polModel.title,
        charName: option,
        votes: options.length,
        value: options.length * 10,
      } as PolWaifuOptionModel);
    }
  }
}
