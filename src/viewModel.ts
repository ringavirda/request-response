import { Character } from "./models/character";
import { VisionColors } from "./models/visionColors";

import characterTemplate from "./components/character.html";
import errorTemplate from "./components/error.html";

export class ViewModel {
  private _renderer: HTMLElement = null!;

  constructor(tag: string) {
    try {
      this.bind(tag);
    } catch {
      this._renderer = document.getElementsByTagName("body")[0];
    }
  }

  bind(tag: string): void {
    const element = document.getElementById(tag);
    if (element != null) {
      this._renderer = element;
      this._isBound = true;
    } else throw new Error(`ViewModel cannot bind to [${tag}].`);
  }

  clear(): void {
    this._renderer.innerHTML = "";
  }

  private _isBound: boolean = false;
  get isBound(): boolean {
    return this._isBound;
  }

  displayCharacter(char: Character): void {
    const characterElement = document.createElement("div");
    characterElement.innerHTML = characterTemplate;

    const nameElement =
      characterElement.querySelector<HTMLDivElement>(".char-name");
    if (nameElement != null) nameElement.textContent = char.name;
    const titleElement =
      characterElement.querySelector<HTMLDivElement>(".char-title");
    if (titleElement != null) titleElement.textContent = char.title;
    const weaponElement =
      characterElement.querySelector<HTMLDivElement>(".char-weapon");
    if (weaponElement != null) weaponElement.textContent = char.weapon;
    const nationElement =
      characterElement.querySelector<HTMLDivElement>(".char-nation");
    if (nationElement != null) nationElement.textContent = char.nation;
    const descElement =
      characterElement.querySelector<HTMLDivElement>(".char-description");
    if (descElement != null) descElement.textContent = char.description;

    const genderElement =
      characterElement.querySelector<HTMLDivElement>(".char-gender");
    if (genderElement != null) {
      genderElement.textContent = char.gender;
      if (char.gender === "Female")
        genderElement.style.backgroundColor = "pink";
      else genderElement.style.backgroundColor = "aqua";
    }

    const rarityElement =
      characterElement.querySelector<HTMLDivElement>(".char-rarity");
    if (rarityElement != null)
      rarityElement.textContent = String.fromCodePoint(0x2b50).repeat(
        char.rarity,
      );

    let characterColor =
      VisionColors[
        char.vision.toLocaleLowerCase() as keyof typeof VisionColors
      ];
    if (characterColor == null) {
      characterColor = VisionColors.default;
    }

    const visionElement =
      characterElement.querySelector<HTMLDivElement>(".char-vision");
    if (visionElement != null) {
      visionElement.style.backgroundColor = characterColor;
      visionElement.textContent = char.vision;
    }

    const constElement =
      characterElement.querySelector<HTMLDivElement>(".char-const-name");
    if (constElement != null) {
      constElement.style.backgroundColor = characterColor;
      constElement.textContent = char.constellation;
    }

    const portraitElement =
      characterElement.querySelector<HTMLImageElement>(".char-portrait");
    if (portraitElement != null) {
      portraitElement.src = char.portraitUrl;
      const borderStyle = `thick solid ${characterColor}`;
      portraitElement.style.borderTop = borderStyle;
      portraitElement.style.borderRight = borderStyle;
      portraitElement.style.borderBottom = borderStyle;
    }
    this._renderer?.appendChild(characterElement);
  }

  displayError(message: string): void {
    const errorElement = document.createElement("div");
    errorElement.innerHTML = errorTemplate;

    const messageElement =
      errorElement.querySelector<HTMLDivElement>(".err-message");
    if (messageElement != null) messageElement.textContent = message;

    this._renderer?.appendChild(errorElement);
  }
}
