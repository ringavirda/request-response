import { Character } from "./models/character.js";
import { VisionColors } from "./models/visionColors.js";

import errorTemplate from "../error.html";
import characterTemplate from "../character.html";

export class ViewModel {
    private _renderer: HTMLElement;

    constructor(tag: string) {
        try {
            this.bind(tag);

        } finally {
            this._renderer = document.getElementsByTagName("body")[0];
        }
    }

    bind(tag: string) {
        const element = document.getElementById(tag);
        if (element instanceof HTMLElement) {
            this._renderer = element;
            this._isBound = true;
        }
        else throw new Error(`ViewModel cannot bind to [${tag}].`)
    }

    private _isBound: boolean = false;
    get isBound(): boolean { return this._isBound }

    displayCharacter(char: Character): void {
        const characterElement = document.createElement("div");
        characterElement.innerHTML = characterTemplate;

        const nameElement = characterElement.querySelector<HTMLDivElement>(".char-name");
        if (nameElement != null) nameElement.textContent = char.name;
        const titleElement = characterElement.querySelector<HTMLDivElement>(".char-title");
        if (titleElement != null) titleElement.textContent = char.name;
        const weaponElement = characterElement.querySelector<HTMLDivElement>(".char-weapon");
        if (weaponElement != null) weaponElement.textContent = char.name;
        const genderElement = characterElement.querySelector<HTMLDivElement>(".char-gender");
        if (genderElement != null) genderElement.textContent = char.name;
        const nationElement = characterElement.querySelector<HTMLDivElement>(".char-nation");
        if (nationElement != null) nationElement.textContent = char.name;
        const descElement = characterElement.querySelector<HTMLDivElement>(".char-description");
        if (descElement != null) descElement.textContent = char.name;

        const rarityElement = characterElement.querySelector<HTMLDivElement>(".char-rarity");
        if (rarityElement != null) rarityElement.textContent = "&#11088".repeat(char.rarity);

        let characterColor = VisionColors[char.vision as keyof typeof VisionColors];
        if (characterColor == null) {
            characterColor = VisionColors.default;
        }

        const visionElement = characterElement.querySelector<HTMLDivElement>(".char-vision");
        if (visionElement != null) {
            visionElement.style.backgroundColor = characterColor;
            visionElement.textContent = char.vision;
        }

        const constElement = characterElement.querySelector<HTMLDivElement>(".char-const-name");
        if (constElement != null) {
            constElement.style.backgroundColor = characterColor;
            constElement.textContent = char.constellation;
        }

        this._renderer.appendChild(characterElement);
    }

    displayError(message: string): void {
        const errorElement = document.createElement("div");
        errorElement.innerHTML = errorTemplate;

        const messageElement = errorElement.querySelector<HTMLDivElement>("err-message");
        if (messageElement != null) messageElement.textContent = message;

        this._renderer.appendChild(errorElement);
    }
}