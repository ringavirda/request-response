import "./chars.list.scss";
import template from "./chars.list.html";

import { component, ComponentBase, loadComponent } from "@client/framework";

import { CharsCard } from "../char-card/charCard";
import { CharError } from "../char-error/charError";
import { CharsModel } from "../chars";

@component("chars-list", template, true)
export class CharsList extends ComponentBase {
  private _charsList: HTMLDivElement;

  constructor() {
    super(CharsList);

    this._charsList = this.getElement(".chars-list");
  }

  public override async initialize(
    anchor?: HTMLElement,
    model?: CharsModel,
  ): Promise<void> {
    model = this.modelIsDefined(model);

    await this.loadWaifus(model.default);
  }

  public clearCharacterList(): void {
    this._charsList.innerHTML = "";
  }

  public async loadWaifus(waifus: Array<string>): Promise<void> {
    this.clearCharacterList();
    await Promise.all(
      waifus.map(async (waifu) => {
        await this.addCharacter(waifu);
      }),
    );
  }

  private async addCharacter(char: string): Promise<void> {
    try {
      await loadComponent(this._charsList, CharsCard, char);
    } catch (error: unknown) {
      await this.addError(error as Error);
    }
  }

  private async addError(error: Error): Promise<void> {
    await loadComponent(this._charsList, CharError, error);
  }
}
