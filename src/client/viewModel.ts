import { CharacterCard } from "../common/components/character-card/characterCard";
import { RequestError } from "../common/components/req-error/reqError";
import { Character } from "../common/models/character";

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
    const characterCard = new CharacterCard(char);
    // Render constructed component into anchor.
    this._renderer?.appendChild(characterCard.element);
  }

  /**
   * Renders simple error component onto the web-page.
   *
   * @param message string containing error message.
   */
  displayError(message: string): void {
    const reqErr = new RequestError(message);
    // Render constructed component into anchor.
    this._renderer?.appendChild(reqErr.element);
  }
}
