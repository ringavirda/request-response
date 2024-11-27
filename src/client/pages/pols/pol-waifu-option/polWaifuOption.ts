import "./pol.waifu.option.scss";
import template from "./pol.waifu.option.html";
import { component, ComponentBase } from "@client/framework";
import { VisionColors } from "@common/models";
import { CharsApi } from "@client/services/charsApi";
import { PolWaifuOptionModel } from "../pol-waifu/polWaifu";
import { PolsValues } from "@client/services/polsValues";

@component("pol-waifu-option", template, true)
export class PolWaifuOption extends ComponentBase {
  private _polOptionFill: HTMLDivElement;
  private _polOptionInfo: HTMLDivElement;

  private _polOptionPick: HTMLDivElement;

  constructor(
    private readonly _api: CharsApi,
    private readonly _values: PolsValues,
  ) {
    super(PolWaifuOption);

    this._polOptionFill = this.getElement(".pol-waifu-fill");
    this._polOptionInfo = this.getElement(".pol-waifu-info");
    this._polOptionPick = this.getElement(".pol-waifu-pick");
  }

  public override async initialize(
    anchor?: HTMLElement,
    model?: PolWaifuOptionModel,
  ): Promise<void> {
    model = this.modelIsDefined(model);
    const char = await this._api.fetchCharacter(model.charName);

    if (this._values.isAlreadyVoted(model.polTitle))
      this._polOptionPick.classList.add("pol-waifu-disabled");
    else this._polOptionPick.classList.remove("pol-waifu-disabled");

    this._polOptionPick.addEventListener("click", () => {
      this._values.incOptionValue(model.polTitle, model.charName);
    });

    this._values.on("update", (pol) => {
      if (pol.title === model.polTitle) {
        const value = this._values.getOptionValue(
          model.polTitle,
          model.charName,
        );
        this._polOptionFill.style.width = `${value}%`;
        this._polOptionInfo.textContent = `${char.name}:${pol.options.get(model.charName)?.length}`;

        if (this._values.isAlreadyVoted(pol.title))
          this._polOptionPick.classList.add("pol-waifu-disabled");
        else this._polOptionPick.classList.remove("pol-waifu-disabled");
      }
    });

    let charColor =
      VisionColors[
        char.vision.toLocaleLowerCase() as keyof typeof VisionColors
      ];
    if (charColor == null) {
      charColor = VisionColors.default;
    }

    const iconElement = this.getElement<HTMLImageElement>(".pol-waifu-icon");
    try {
      iconElement.src = await this._api.fetchCharacterIcon(
        model.charName,
        "side",
      );
    } catch {
      iconElement.style.backgroundColor = charColor;
    }
    iconElement.style.borderTop = `solid 1px ${charColor}`;
    iconElement.style.borderLeft = `solid 3px ${charColor}`;
    iconElement.style.borderBottom = `solid 1px ${charColor}`;

    const barFill = this.getElement(".pol-waifu-fill");
    barFill.style.backgroundColor = charColor;
    barFill.style.width = `${this._values.getOptionValue(model.polTitle, model.charName)}%`;

    this._polOptionInfo.textContent = `${char.name}:${model.votes.toString()}`;
  }
}
