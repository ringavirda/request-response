import { Character } from "./models/character";

/**
 * Repository for fetching data from Genshin API.
 */
export class ApiService {
  private _baseApiUrl: string = "https://genshin.jmp.blue/characters" as const;

  // Cashes.
  private _waifuCashe: Map<string, Character> = new Map();
  private _portraitCashe: Map<string, [Blob, string]> = new Map();

  /**
   * Example of fetching being made with old `XMLHttpRequest` api. It is recommended
   * to avoid this API if possible.
   *
   * @param target A waifu to download.
   * @param callback Conventional callback function to process operation result.
   */
  rawXMLHttpRequest(
    target: string,
    callback: (error: string, char: Character | null) => void,
  ): void {
    // Create request instance.
    const request = new XMLHttpRequest();
    // Register inner callback on the request.
    request.addEventListener("readystatechange", () => {
      if (request.readyState === 4 && request.status === 200) {
        // Process if operation is a success.
        const char = JSON.parse(request.responseText) as Character;
        // Construct portrait url.
        char.portraitUrl = `${this._baseApiUrl}/${char.name.toLowerCase()}/portrait`;
        // Pass to client's callback.
        callback("", char);
      } else if (request.readyState === 4) {
        // Process if errors were received.
        callback(`Wasn't able to load target [${target}].`, null);
      }
    });

    // Open the connection.
    request.open("GET", `${this._baseApiUrl}/${target}`);
    // Send request.
    request.send();
  }

  /**
   * Example of old API being wrapped into `Promise` class. Changes how this
   * method is utilized outside of the class.
   *
   * @param target A waifu to download.
   * @returns Promise to requested waifu.
   */
  promiseXMLHttpRequest(target: string): Promise<Character> {
    return new Promise((resolve, reject) => {
      // Create request instance.
      const request = new XMLHttpRequest();
      // Register inner callback on the request.
      request.addEventListener("readystatechange", () => {
        if (request.readyState === 4 && request.status === 200) {
          // Process if operation is a success.
          const char = JSON.parse(request.responseText) as Character;
          // Construct portrait url.
          char.portraitUrl = `${this._baseApiUrl}/${char.name.toLowerCase()}/portrait`;
          // Pass to client's callback.
          resolve(char);
        } else if (request.readyState === 4) {
          // Process if errors were received.
          reject(`Wasn't able to load target [${target}].`);
        }
      });
      // Open the connection.
      request.open("GET", `${this._baseApiUrl}/${target}`);
      // Send request.
      request.send();
    });
  }

  /**
   * Example of using modern Fetch API to make a request. It is recommend to use
   * this wherever possible.
   *
   * @returns List of valid waifu targets.
   */
  async fetchWaifuList(): Promise<Array<string>> {
    // Make request.
    const response = await fetch(`${this._baseApiUrl}`);
    // Process errors.
    if (!response.ok)
      throw new Error(`Wasn't able to load waifu list! Oh, no...`);
    // Return response as json.
    return response.json();
  }

  /**
   * Loads next waifu using provided identifier. Uses cashing to lower amount of
   * request to external API. Internally loads waifu's media.
   *
   * @param target A waifu to load.
   * @returns Promise to a waifu's `Character`.
   */
  async fetchHttpRequest(target: string): Promise<Character> {
    if (this._waifuCashe.has(target))
      // If waifu exists in cashe return already known values.
      return this._waifuCashe.get(target) as Character;
    // Make a request to target.
    const response = await fetch(`${this._baseApiUrl}/${target}`);
    if (!response.ok)
      // Notify outside that something went wrong.
      throw new Error(
        `Wasn't able to load target [${target}].\n${response.statusText}`,
      );
    // Parse response json.
    const char = (await response.json()) as Character;
    // Load character's portrait.
    const charPortrait = await this.fetchWaifuPortrait(target);
    // Construct internal URL to image blob.
    char.portraitUrl = charPortrait;
    // Return fetched character.
    return char;
  }

  /**
   * Fetches media for given waifu. Uses cashing to speed up processing and lover
   * the amount of requests to the external server.
   *
   * @param target A waifu, media of which needs to be loaded.
   * @returns Promise to sa URL to the loaded image blob.
   */
  async fetchWaifuPortrait(target: string): Promise<string> {
    if (this._portraitCashe.has(target))
      // Return cashed value if present.
      return this._portraitCashe.get(target)?.[1] as string;
    // Construct portrait url.
    const urlPortrait = `${this._baseApiUrl}/${target}/portrait`;
    // Fetch waifu's portrait.
    let response = await fetch(urlPortrait);
    if (!response.ok) {
      // If portrait load failed, try loading card.
      const urlCard = `${this._baseApiUrl}/${target}/card`;
      response = await fetch(urlCard);
      if (!response.ok)
        // Parse errors if failed.
        throw new Error(`Failed to load media for target [${target}].`);
    }
    // Parse loaded image blob.
    const blob = await response.blob();
    // Create browser local url to blob.
    const blobUrl = URL.createObjectURL(blob);
    // Populate portrait cashe.
    this._portraitCashe.set(target, [blob, blobUrl]);
    // Return portrait url.
    return blobUrl;
  }
}
