import { singleton } from "tsyringe";

import { fetchCurrentIp, toSha256String } from "@client/framework";
import { WaifuPol } from "@common/models";

export type PolValueEvents = "changed";
export type PolValueEventListener = (pol: WaifuPol) => void;

@singleton()
export class PolsValues {
  private _pols: Array<WaifuPol> = [];
  private _ipHash: string = "";

  private readonly _maxValue: number = 90;
  private readonly _minValue: number = 10;

  private _listeners: Map<PolValueEvents, Array<PolValueEventListener>> =
    new Map();

  public async registerPols(pols: Array<WaifuPol>): Promise<void> {
    this._pols = pols;
    this._ipHash = await toSha256String(await fetchCurrentIp());
  }

  public on(event: PolValueEvents, callback: PolValueEventListener) {
    const listeners = this._listeners.get(event);
    if (listeners === undefined) this._listeners.set(event, [callback]);
    else {
      listeners.push(callback);
      this._listeners.set(event, listeners);
    }
  }

  public emit(event: PolValueEvents, model: WaifuPol) {
    this._listeners.get(event)?.forEach((listener) => listener(model));
  }

  public getOptionValue(polTitle: string, optionName: string) {
    const pol = this.getPol(polTitle);
    const selected = this.getOption(polTitle, optionName);

    const options = Array.from(pol.options.values());
    const maxVotes = options
      .map((opt) => opt.length)
      .reduce((prev, curr) => Math.max(prev, curr));

    const value = Math.ceil((selected.length / maxVotes) * this._maxValue);
    return value > this._minValue ? value : this._minValue;
  }

  public incOptionValue(polTitle: string, optionName: string): void {
    const selected = this.getOption(polTitle, optionName);

    // if (selected.includes(ipHash))
    //   throw new Error("You cannot vote twice!");

    selected.push(this._ipHash);
    this.emit("changed", this.getPol(polTitle));
  }

  public decOptionValue(polTitle: string, optionName: string): void {
    const selected = this.getOption(polTitle, optionName);

    const index = selected.findIndex((vote) => vote === this._ipHash);
    selected.splice(index, 1);
    this.emit("changed", this.getPol(polTitle));
  }

  public isAlreadyVoted(polTitle: string): boolean {
    const pol = this.getPol(polTitle);

    return Array.from(pol.options.values()).some(
      (opt) => opt.find((vote) => vote === this._ipHash) !== undefined,
    );
  }

  private getPol(polTitle: string): WaifuPol {
    const pol = this._pols.find((p) => p.title === polTitle);
    if (pol === undefined)
      throw new Error("Trying to get value from unknown pol.");
    return pol;
  }

  private getOption(polTitle: string, optionName: string): string[] {
    const pol = this.getPol(polTitle);
    const option = pol.options.get(optionName);
    if (option === undefined)
      throw new Error("Trying to get value for unknown option.");
    return option;
  }
}
