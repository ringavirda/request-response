import "./home.princess.scss";
import template from "./home.princess.html";

import { commonHostname, commonPort } from "@common/routes";
import { component, ComponentBase } from "@client/framework";

type PrincessBuffer = {
  blobUrl: string;
  blob: Blob;
};

@component("home-princess", template, true)
export class HomePrincess extends ComponentBase {
  private _princessElement: HTMLImageElement;
  private _princessUrl = `http://${commonHostname}:${commonPort}/api/princess`;
  private _princessGenshinUrl =
    "https://genshin.jmp.blue/characters/keqing/outfit-opulent-splendor";
  private _princessBuffer?: PrincessBuffer;

  constructor() {
    super(HomePrincess);

    this._princessElement = this.getElement<HTMLImageElement>(".home-princess");
  }

  public override async initialize(): Promise<void> {
    if (this._princessBuffer !== undefined)
      this._princessElement.src = this._princessBuffer.blobUrl;

    let resp = await fetch(this._princessUrl);
    if (!resp.ok) {
      resp = await fetch(this._princessGenshinUrl);
      if (!resp.ok) throw new Error("Both apis are down!");
    }
    const blob = await resp.blob();
    const blobUrl = URL.createObjectURL(blob);

    this._princessBuffer = {
      blob: blob,
      blobUrl: blobUrl,
    };
    this._princessElement.src = blobUrl;
  }
}
