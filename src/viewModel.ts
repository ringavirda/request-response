import { Character } from "./models/character";
import { VisionColors } from "./models/visionColors";

import characterTemplate from "./components/character.html";
import errorTemplate from "./components/error.html";

/**
 * Encapsulates logic for displaying dynamic components on the web-page.
 */
export class ViewModel {
  // Anchor element.
  private _renderer: HTMLElement = null!;

  /**
   * Constructor that creates and tries to bind `ViewModel` to given element Id.
   * Binds to `<body>` tag if tag is invalid.
   *
   * @param tag identifier, pointing to the anchor element.
   */
  constructor(tag: string = "body") {
    try {
      // Try binding to provided tag.
      this.bind(tag);
    } catch {
      // Bind to <body> if something unexpected happens.
      this._renderer = document.getElementsByTagName("body")[0];
    }
  }

  /**
   * Tries to bind this model to given element.
   *
   * @param tag identifier, pointing to the anchor element.
   */
  bind(tag: string): void {
    // Try fetch possible anchor element.
    const element = document.getElementById(tag);
    if (element != null) {
      // Update fields if tag is fine.
      this._renderer = element;
      this._isBound = true;
    }
    // Pass and error if binding fails.
    else throw new Error(`ViewModel cannot bind to [${tag}].`);
  }

  /**
   * Remove everything from bound element.
   */
  clear(): void {
    this._renderer.innerHTML = "";
  }

  private _isBound: boolean = false;
  /**
   * Returns `true` if this model was already bound.
   */
  get isBound(): boolean {
    return this._isBound;
  }

  /**
   * Loads character component and renders given model through it.
   *
   * @param char `Character` model of next waifu to display on the page.
   */
  displayCharacter(char: Character): void {
    // Create mounting point.
    const characterElement = document.createElement("div");
    characterElement.innerHTML = characterTemplate;
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
    // Render constructed component into anchor.
    this._renderer?.appendChild(characterElement);
  }

  /**
   * Renders simple error component onto the web-page.
   *
   * @param message string containing error message.
   */
  displayError(message: string): void {
    // Create mounting point.
    const errorElement = document.createElement("div");
    errorElement.innerHTML = errorTemplate;
    // Set message.
    const messageElement =
      errorElement.querySelector<HTMLDivElement>(".err-message");
    if (messageElement != null) messageElement.textContent = message;
    // Render constructed component into anchor.
    this._renderer?.appendChild(errorElement);
  }
}
