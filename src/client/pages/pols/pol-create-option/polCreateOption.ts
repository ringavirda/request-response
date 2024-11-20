import "./pol.create.option.scss";
import template from "./pol.create.option.html";
import { component, ComponentBase } from "@client/framework";
import { PolCreateOptionModel } from "../pol-create/polCreate";
import { CharsApi } from "@client/services/charsApi";
import { VisionColors } from "@common/models";

@component("pol-create-option", template, true)
export class PolCreateOption extends ComponentBase {
  constructor(private readonly _apiChars: CharsApi) {
    super(PolCreateOption);
  }

  public async initialize(
    anchor?: HTMLElement,
    model?: PolCreateOptionModel,
  ): Promise<void> {
    model = this.modelIsDefined(model);
    const char = await this._apiChars.fetchCharacter(model.char);
    let charColor =
      VisionColors[
        char.vision.toLocaleLowerCase() as keyof typeof VisionColors
      ];
    if (charColor == null) {
      charColor = VisionColors.default;
    }

    this.getElement(".pol-create-waifu-remove").addEventListener("click", () =>
      model.removeCallback(model.char),
    );
    const iconElement = this.getElement<HTMLImageElement>(
      ".pol-create-waifu-icon",
    );
    try {
      iconElement.src = await this._apiChars.fetchCharacterIcon(
        model.char,
        "side",
      );
    } catch {
      iconElement.style.backgroundColor = charColor;
    }

    iconElement.style.borderTop = `solid 1px ${charColor}`;
    iconElement.style.borderLeft = `solid 3px ${charColor}`;
    iconElement.style.borderBottom = `solid 1px ${charColor}`;

    this.getElement(".pol-create-waifu-name").textContent = char.name;

    this.getElement(".pol-create-waifu-bar").style.backgroundColor = charColor;
  }
}
