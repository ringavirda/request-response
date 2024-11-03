import "./character_card.scss";
import template from "./character_card.html";
import { Character } from "../../models/character";
import { VisionColors } from "../../models/visionColors";

export class CharacterCard {
  public element: HTMLDivElement;

  constructor(char: Character) {
    // Create mounting point.
    const characterElement = document.createElement("div");
    characterElement.innerHTML = template;
    // Populate component with plain model values.
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
    // Set character's gender while changing styles.
    const genderElement =
      characterElement.querySelector<HTMLDivElement>(".char-gender");
    if (genderElement != null) {
      genderElement.textContent = char.gender;
      if (char.gender === "Female")
        genderElement.style.backgroundColor = "pink";
      else if (char.gender == "Male")
        genderElement.style.backgroundColor = "aqua";
      else {
        genderElement.style.backgroundColor = "gold";
        genderElement.textContent = "Descender";
      }
    }
    // Display rarity as a string of stars.
    const rarityElement =
      characterElement.querySelector<HTMLDivElement>(".char-rarity");
    if (rarityElement != null)
      rarityElement.textContent = String.fromCodePoint(0x2b50).repeat(
        char.rarity,
      );
    // Determine character element's main color.
    let characterColor =
      VisionColors[
        char.vision.toLocaleLowerCase() as keyof typeof VisionColors
      ];
    if (characterColor == null) {
      characterColor = VisionColors.default;
    }
    // Set character's vision element and color.
    const visionElement =
      characterElement.querySelector<HTMLDivElement>(".char-vision");
    if (visionElement != null) {
      visionElement.style.backgroundColor = characterColor;
      visionElement.textContent = char.vision;
    }
    // Set character's constellation element and color.
    const constElement =
      characterElement.querySelector<HTMLDivElement>(".char-const");
    if (constElement != null) {
      constElement.style.backgroundColor = characterColor;
      constElement.textContent = char.constellation;
    }
    // Load and set character's portrait, while rendering partial border.
    const portraitElement =
      characterElement.querySelector<HTMLImageElement>(".char-portrait");
    if (portraitElement != null) {
      portraitElement.src = char.portraitUrl;
      const borderStyle = `thick solid ${characterColor}`;
      portraitElement.style.borderTop = borderStyle;
      portraitElement.style.borderRight = borderStyle;
      portraitElement.style.borderBottom = borderStyle;
    }
    this.element = characterElement;
  }
}
