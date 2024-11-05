import "./character.card.scss";
import template from "./character.card.html";

import { injectable } from "tsyringe";
import { Character } from "@common/models";
import { ComponentBase } from "@client/components/components";
import { VisionColors } from "../visionColors";

@injectable()
export class CharacterCard extends ComponentBase {
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

  constructor() {
    super(template);

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
    model?: Character,
  ): Promise<void> {
    model = this.validateModel(model);

    // Populate component with plain model values.
    this._nameElement.textContent = model.name;
    this._titleElement.textContent = model.title;
    this._weaponElement.textContent = model.weapon;
    this._nationElement.textContent = model.nation;
    this._descElement.textContent = model.description;
    // Set character's gender while changing styles.
    this._genderElement.textContent = model.gender;
    if (model.gender === "Female")
      this._genderElement.style.backgroundColor = "pink";
    else if (model.gender == "Male")
      this._genderElement.style.backgroundColor = "aqua";
    else {
      this._genderElement.style.backgroundColor = "gold";
      this._genderElement.textContent = "Descender";
    }
    // Display rarity as a string of stars.
    this._rarityElement.textContent = String.fromCodePoint(0x2b50).repeat(
      model.rarity,
    );
    // Determine character element's main color.
    let characterColor =
      VisionColors[
        model.vision.toLocaleLowerCase() as keyof typeof VisionColors
      ];
    if (characterColor == null) {
      characterColor = VisionColors.default;
    }
    // Set character's vision element and color.
    this._visionElement.style.backgroundColor = characterColor;
    this._visionElement.textContent = model.vision;
    // Set character's constellation element and color.
    this._constElement.style.backgroundColor = characterColor;
    this._constElement.textContent = model.constellation;
    // Load and set character's portrait, while rendering partial border.
    this._portraitElement.src = model.portraitUrl;
    const borderStyle = `thick solid ${characterColor}`;
    this._portraitElement.style.borderTop = borderStyle;
    this._portraitElement.style.borderRight = borderStyle;
    this._portraitElement.style.borderBottom = borderStyle;
  }
}
