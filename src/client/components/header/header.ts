import "./header.scss";
import template from "./header.html";
import { singleton } from "tsyringe";
import { ApiService } from "@client/services/genshinApi";
import { ComponentBase } from "@common/components";
import { AppRouter } from "@client/services/appRouter";

@singleton()
export class AppHeader extends ComponentBase {
  private _waifuListElement: HTMLDivElement;
  private _titleElement: HTMLAnchorElement;

  constructor(
    private readonly _api: ApiService,
    private readonly _router: AppRouter,
  ) {
    super(template);

    this._waifuListElement = this.getElement(".waifu-list");
    this._titleElement = this.getElement(".title");
  }

  public override async initialize(): Promise<void> {
    const waifuList = await this._api.fetchWaifuList();
    this._waifuListElement.textContent = waifuList.join(", ");

    this._titleElement.addEventListener("click", (e) => {
      e.preventDefault();
      window.history.pushState({}, "", (e.target as HTMLAnchorElement).href);
      this._router.changeLocation((e.target as HTMLAnchorElement).pathname);
    });
  }
}
