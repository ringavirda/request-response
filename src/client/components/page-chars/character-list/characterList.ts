import "./character.list.scss";
import template from "./character.list.html";

import { injectable } from "tsyringe";
import { ApiService } from "@client/services/charactersApi";
import { Character } from "@common/models";
import { ComponentBase, loadComponent } from "@client/components/components";
import { CharacterCard } from "../character-card/characterCard";
import { RequestError } from "../req-error/reqError";

@injectable()
export class CharacterList extends ComponentBase {
  private _ctrlInput: HTMLInputElement;
  private _ctrlBtnGet: HTMLButtonElement;
  private _ctrlBtnRandom: HTMLButtonElement;

  private _defaultWaifus = ["keqing", "ayaka", "nilou", "chiori"];
  private _waifuBuffer: Array<string> = [];
  private _characterList: HTMLDivElement;

  constructor(private readonly _api: ApiService) {
    super(template);

    this._ctrlInput = this.getElement(".ctrl-input");
    this._ctrlBtnGet = this.getElement(".ctrl-btn-get");
    this._ctrlBtnRandom = this.getElement(".ctrl-btn-rnd");

    this._characterList = this.getElement(".chars-list");
  }

  public override async initialize(): Promise<void> {
    this._ctrlBtnGet.addEventListener("click", async () => {
      const waifus = this.parseInput(this._ctrlInput.value);
      if (
        waifus.length === this._waifuBuffer.length &&
        waifus.every((element, index) => element === this._waifuBuffer[index])
      ) {
        return;
      }
      this._waifuBuffer = waifus;
      await this.loadWaifus(waifus);
    });

    this._ctrlBtnRandom.addEventListener("click", async () => {
      const waifuList = await this._api.fetchWaifuList();
      const waifuPos: Array<number> = [];
      while (waifuPos.length < 10) {
        const next = Math.floor(Math.random() * waifuList.length);
        if (waifuPos.indexOf(next) === -1) waifuPos.push(next);
      }
      const waifus = waifuPos.map((pos) => waifuList[pos]);
      await this.loadWaifus(waifus);
      if (this._ctrlInput !== null)
        this._ctrlInput.placeholder = waifus.join(", ");
    });

    this._ctrlInput.placeholder = this._defaultWaifus.join(", ");
    await this.loadWaifus(this._defaultWaifus);
  }

  private clearCharacterList(): void {
    this._characterList.innerHTML = "";
  }

  private async loadWaifus(waifus: Array<string>): Promise<void> {
    this.clearCharacterList();
    await Promise.all(
      waifus.map(async (waifu) => {
        try {
          const char = await this._api.fetchHttpRequest(waifu);
          this.addCharacter(char);
        } catch (error: unknown) {
          this.addError(error as Error);
        }
      }),
    );
  }

  private addCharacter(char: Character): void {
    loadComponent(this._characterList, CharacterCard, char);
  }

  private addError(error: Error): void {
    loadComponent(this._characterList, RequestError, error);
  }

  private parseInput(raw: string | null | undefined): Array<string> {
    if (raw == "" || raw == undefined) return [];
    const rawUnfiltered = raw
      .split(",")
      .map((w) => w.trim().toLowerCase())
      .filter((w) => w != "");
    return rawUnfiltered.filter(
      (waifu, index) => rawUnfiltered.indexOf(waifu) === index,
    );
  }
}
