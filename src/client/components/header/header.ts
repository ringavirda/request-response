import "./header.scss";
import template from "./header.html";
import { singleton } from "tsyringe";
import { ApiService } from "@client/services/genshinApi";
import { ComponentBase } from "@common/components";

@singleton()
export class AppHeader extends ComponentBase {
  private _waifuListElement: HTMLDivElement;

  constructor(private readonly _api: ApiService) {
    super(template);

    this._waifuListElement = this.getElement(".waifu-list");
  }

  public override async initialize(): Promise<void> {
    const waifuList = await this._api.fetchWaifuList();
    this._waifuListElement.textContent = waifuList.join(", ");
  }
}
