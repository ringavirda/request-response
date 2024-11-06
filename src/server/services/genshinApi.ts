import { Character } from "@common/models";
import { singleton } from "tsyringe";

interface WaifuCacheEntry {
  character: Character;
  blobs: Map<string, Blob>;
}

@singleton()
export class GenshinApiService {
  private _baseApiUrl: string = "https://genshin.jmp.blue/characters" as const;

  private _waifuCache: Map<string, WaifuCacheEntry> = new Map();

  public async fetchCharacterList(): Promise<Array<string>> {
    const response = await fetch(this._baseApiUrl);
    if (!response.ok)
      throw new Error(`Wasn't able to load waifu list! Oh, no...`);

    return response.json();
  }

  public async fetchCharacter(target: string): Promise<Character> {
    if (this._waifuCache.has(target))
      return this._waifuCache.get(target)?.character as Character;

    const response = await fetch(`${this._baseApiUrl}/${target}`);
    if (!response.ok)
      throw new Error(`Wasn't able to load target [${target}].`);

    const char = (await response.json()) as Character;
    const charLite = {
      name: char.name,
      title: char.title,
      vision: char.vision,
      gender: char.gender,
      rarity: char.rarity,
      nation: char.nation,
      weapon: char.weapon,
      constellation: char.constellation,
      description: char.description,
    } as Character;

    this._waifuCache.set(target, {
      character: charLite,
      blobs: new Map(),
    });

    return charLite;
  }

  public async fetchCharacterPortrait(target: string): Promise<Blob> {
    return await this.fetchCharacterMedia("portrait", target);
  }

  public async fetchCharacterCard(target: string): Promise<Blob> {
    return await this.fetchCharacterMedia("card", target);
  }

  public async fetchCharacterIcon(
    target: string,
    iconType: string,
  ): Promise<Blob> {
    if (!["", "side", "big"].includes(iconType))
      throw new Error(`Api: Unsupported icon type: ${iconType}.`);
    if (iconType !== "") iconType = `-${iconType}`;
    return await this.fetchCharacterMedia(`icon${iconType}`, target);
  }

  private async fetchCharacterMedia(
    type: string,
    target: string,
  ): Promise<Blob> {
    if (this._waifuCache.has(target)) {
      const blob = this._waifuCache.get(target)?.blobs.get(type);
      if (blob !== undefined) return blob;
    }

    const urlMedia = `${this._baseApiUrl}/${target}/${type}`;
    const res = await fetch(urlMedia);
    if (!res.ok)
      throw new Error(`Failed to load media for target [${target}].`);

    const blob = await res.blob();

    if (this._waifuCache.has(target)) {
      const cached = this._waifuCache.get(target) as WaifuCacheEntry;
      cached.blobs.set(type, blob);
    } else {
      const char = await this.fetchCharacter(target);
      this._waifuCache.set(target, {
        character: char,
        blobs: new Map([[type, blob]]),
      });
    }

    return blob;
  }
}