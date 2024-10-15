import { Character } from "./models/character";

export class ApiService {
  private _baseApiUrl: string = "https://genshin.jmp.blue/characters" as const;

  XMLHttpRequest(target: string, callback: CallableFunction): void {
    const request = new XMLHttpRequest();

    request.addEventListener("readystatechange", () => {
      if (request.readyState === 4 && request.status === 200) {
        callback(null, this.responseToCharacter(request.responseText));
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
          resolve(this.responseToCharacter(request.responseText));
        } else if (request.readyState === 4) {
          reject(`Wasn't able to load target [${target}].`);
        }
      });

      request.open("GET", `${this._baseApiUrl}/${target}`);
      request.send();
    });
  }

  async fetchHttpRequest(target: string): Promise<Character> {
    const response = await fetch(`${this._baseApiUrl}/${target}`);
    if (!response.ok)
      throw new Error(
        `Wasn't able to load target [${target}].\n${response.statusText}`,
      );
    const char = (await response.json()) as Character;
    char.portraitUrl = `${this._baseApiUrl}/${target}/portrait`;
    return char;
  }

  private responseToCharacter(respText: string): Character {
    const char = JSON.parse(respText) as Character;
    char.portraitUrl = `${
      this._baseApiUrl
    }/${char.name.toLowerCase()}/portrait`;
    return char;
  }
}
