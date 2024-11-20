export class Character {
  constructor(
    public name: string = "",
    public title: string = "",
    public vision: string = "",
    public weapon: string = "",
    public gender: string = "",
    public nation: string = "",
    public rarity: number = NaN,
    public constellation: string = "",
    public description: string = "",
  ) {}
}

export const VisionColors = {
  pyro: "red",
  hydro: "blue",
  dendro: "lightgreen",
  geo: "orange",
  cryo: "lightblue",
  anemo: "teal",
  electro: "blueviolet",
  default: "golden",
} as const;

export class WaifuPol {
  constructor(
    public title: string = "",
    public description?: string,
    public options: Map<string, Array<string>> = new Map(),
  ) {}
}
