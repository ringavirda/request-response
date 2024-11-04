import "./characters.scss";
import template from "./characters.html";
import { singleton } from "tsyringe";
import { ApiService } from "@client/services/genshinApi";
import { Character } from "@common/models";
import {
  CharacterCard,
  ComponentBase,
  loadComponent,
  RequestError,
} from "@common/components";

@singleton()
export class Characters extends ComponentBase {
  private _ctrlInput: HTMLInputElement;
  private _ctrlBtnGet: HTMLButtonElement;
  private _ctrlBtnRandom: HTMLButtonElement;

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
    // Register next waifu retrieval logic.
    this._ctrlBtnGet.addEventListener("click", () => {
      // Drop request if no changes detected.
      const waifus = this.parseInput(this._ctrlInput.value);
      if (this.compare(waifus, this._waifuBuffer)) return;
      // Load new waifus.
      this._waifuBuffer = waifus;
      this.loadWaifus(waifus);
    });

    // Register random waifu array retrieval logic.
    this._ctrlBtnRandom.addEventListener("click", async () => {
      const waifuList = await this._api.fetchWaifuList();
      // Create unique index array.
      const waifuPos: Array<number> = [];
      while (waifuPos.length < 10) {
        const next = Math.floor(Math.random() * waifuList.length);
        if (waifuPos.indexOf(next) === -1) waifuPos.push(next);
      }
      // Translate using known waifu names.
      const waifus = waifuPos.map((pos) => waifuList[pos]);
      // Load constructed targets.
      this.loadWaifus(waifus);
      // Update placeholder with loaded names.
      if (this._ctrlInput !== null)
        this._ctrlInput.placeholder = waifus.join(", ");
    });

    await this.addDefaults();
  }

  private clearCharacterList(): void {
    this._characterList.innerHTML = "";
  }

  // Load and render Keqing, Chiori and Ayaka using legacy api.
  private async addDefaults() {
    // XML request.
    this._api.rawXMLHttpRequest("keqing", (error, char) => {
      if (error == "" && char != null) {
        this.addCharacter(char);
      } else {
        this.addError(new Error(error));
      }
    });
    // Promise wrapper for the XML request.
    this._api
      .promiseXMLHttpRequest("chiori")
      .then((char) => this.addCharacter(char))
      .catch((error) => this.addError(error));
    // Fetch API.
    try {
      const ayaka = await this._api.fetchHttpRequest("ayaka");
      this.addCharacter(ayaka);
    } catch (error: unknown) {
      this.addError(error as Error);
    }
  }

  private loadWaifus(waifus: Array<string>): void {
    this.clearCharacterList();
    waifus.forEach(async (waifu) => {
      try {
        const char = await this._api.fetchHttpRequest(waifu);
        this.addCharacter(char);
      } catch (error: unknown) {
        this.addError(error as Error);
      }
    });
  }

  private addCharacter(char: Character): void {
    loadComponent(this._characterList, CharacterCard, char);
  }

  private addError(error: Error): void {
    loadComponent(this._characterList, RequestError, error);
  }

  // Helper function to parse string into unique array of targets.
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

  private compare(a: string[], b: string[]): boolean {
    return (
      a.length === b.length && a.every((element, index) => element === b[index])
    );
  }
}
