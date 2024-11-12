import "./char.card.scss";
import template from "./char.card.html";

import { inject } from "tsyringe";
import { component, ComponentBase } from "@client/framework/components";
import { VisionColors } from "../visionColors";
import { ICharsApi } from "@client/services/charsApi";

const portraitResizeHeight = 540 * 2;
const portraitResizeWidth = 340 * 2;

@component("chars-card", template, true)
export class CharsCard extends ComponentBase {
  private _nameElement: HTMLDivElement;
  private _titleElement: HTMLDivElement;
  private _weaponElement: HTMLDivElement;
  private _nationElement: HTMLDivElement;
  private _descElement: HTMLDivElement;
  private _genderElement: HTMLDivElement;
  private _rarityElement: HTMLDivElement;
  private _visionElement: HTMLDivElement;
  private _constElement: HTMLDivElement;
  private _portraitElement: HTMLImageElement;

  constructor(@inject("ICharsApi") private _api: ICharsApi) {
    super(CharsCard);

    this._nameElement = this.getElement(".char-name");
    this._titleElement = this.getElement(".char-title");
    this._weaponElement = this.getElement(".char-weapon");
    this._nationElement = this.getElement(".char-nation");
    this._descElement = this.getElement(".char-description");
    this._genderElement = this.getElement(".char-gender");
    this._rarityElement = this.getElement(".char-rarity");
    this._visionElement = this.getElement(".char-vision");
    this._constElement = this.getElement(".char-const");
    this._portraitElement = this.getElement(".char-portrait");
  }

  public override async initialize(
    anchor?: HTMLElement,
    model?: string,
  ): Promise<void> {
    model = this.modelIsDefined(model);

    const char = await this._api.fetchCharacter(model);

    this._nameElement.textContent = char.name;
    this._titleElement.textContent = char.title;
    this._weaponElement.textContent = char.weapon;
    this._nationElement.textContent = char.nation;
    this._descElement.textContent = char.description;

    this._genderElement.textContent = char.gender;
    if (char.gender === "Female")
      this._genderElement.style.backgroundColor = "pink";
    else if (char.gender == "Male")
      this._genderElement.style.backgroundColor = "aqua";
    else {
      this._genderElement.style.backgroundColor = "gold";
      this._genderElement.textContent = "Descender";
    }

    this._rarityElement.textContent = String.fromCodePoint(0x2b50).repeat(
      char.rarity,
    );

    let characterColor =
      VisionColors[
        char.vision.toLocaleLowerCase() as keyof typeof VisionColors
      ];
    if (characterColor == null) {
      characterColor = VisionColors.default;
    }

    this._visionElement.style.backgroundColor = characterColor;
    this._visionElement.textContent = char.vision;

    this._constElement.style.backgroundColor = characterColor;
    this._constElement.textContent = char.constellation;

    const borderStyle = `thick solid ${characterColor}`;
    this._portraitElement.src = await this._api.fetchCharacterPortrait(
      model,
      portraitResizeHeight,
      portraitResizeWidth,
    );
    this._portraitElement.style.borderTop = borderStyle;
    this._portraitElement.style.borderRight = borderStyle;
    this._portraitElement.style.borderBottom = borderStyle;
  }
}
