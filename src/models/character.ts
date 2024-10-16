/**
 * Model for a waifu. Used to filter out unnecessary properties from the server's
 * response object.
 */
export interface Character {
  name: string;
  title: string;
  vision: string;
  weapon: string;
  gender: string;
  nation: string;
  rarity: number;
  constellation: string;
  description: string;
  portraitUrl: string;
}
