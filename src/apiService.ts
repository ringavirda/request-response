import { Character } from "./models/character";

export class ApiService {
  private _baseApiUrl: string = "https://genshin.jmp.blue/characters" as const;

  private _waifuCashe: Map<string, Character> = new Map();
  private _portraitCashe: Map<string, Blob> = new Map();

  XMLHttpRequest(target: string, callback: CallableFunction): void {
    const request = new XMLHttpRequest();

    request.addEventListener("readystatechange", () => {
      if (request.readyState === 4 && request.status === 200) {
        const char = JSON.parse(request.responseText) as Character;
        char.portraitUrl = `${
          this._baseApiUrl
        }/${char.name.toLowerCase()}/portrait`;
        callback(null, char);
      } else if (request.readyState === 4) {
        callback(`Wasn't able to load target [${target}].`, null);
      }
    });

    request.open("GET", `${this._baseApiUrl}/${target}`);
    request.send();
  }

  promiseXMLHttpRequest(target: string): Promise<Character> {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();

      request.addEventListener("readystatechange", () => {
        if (request.readyState === 4 && request.status === 200) {
          const char = JSON.parse(request.responseText) as Character;
          char.portraitUrl = `${
            this._baseApiUrl
          }/${char.name.toLowerCase()}/portrait`;
          resolve(char);
        } else if (request.readyState === 4) {
          reject(`Wasn't able to load target [${target}].`);
        }
      });

      request.open("GET", `${this._baseApiUrl}/${target}`);
      request.send();
    });
  }

  async fetchWaifuList(): Promise<Array<string>> {
    const response = await fetch(`${this._baseApiUrl}`);
    if (!response.ok)
      throw new Error(`Wasn't able to load waifu list! Oh, no...`);
    return response.json();
  }

  async fetchHttpRequest(target: string): Promise<Character> {
    if (this._waifuCashe.has(target))
      return this._waifuCashe.get(target) as Character;

    const response = await fetch(`${this._baseApiUrl}/${target}`);
    if (!response.ok)
      throw new Error(
        `Wasn't able to load target [${target}].\n${response.statusText}`,
      );

    const char = (await response.json()) as Character;
    const charPortrait = await this.fetchWaifuPortrait(target);
    char.portraitUrl = URL.createObjectURL(charPortrait);
    return char;
  }

  private async fetchWaifuPortrait(target: string): Promise<Blob> {
    if (this._portraitCashe.has(target))
      return this._portraitCashe.get(target) as Blob;

    const urlPortrait = `${this._baseApiUrl}/${target}/portrait`;
    let response = await fetch(urlPortrait);
    if (!response.ok) {
      const urlCard = `${this._baseApiUrl}/${target}/card`;
      response = await fetch(urlCard);
    }

    const blob = await response.blob();
    this._portraitCashe.set(target, blob);
    return blob;
  }
}
