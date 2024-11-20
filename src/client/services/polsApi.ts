import { MapSerializationFixes } from "@common/fixes";
import { WaifuPol } from "@common/models";
import { commonHostname, commonPort } from "@common/routes";

export class PolsApi {
  private readonly _baseApiUrl = `http://${commonHostname}:${commonPort}/api/pols`;

  public async fetchAllPols(): Promise<Array<WaifuPol>> {
    const res = await fetch(this._baseApiUrl);
    if (!res.ok) throw new Error("Failed to load pols list!");
    const json = await res.text();
    return JSON.parse(json, MapSerializationFixes.reviver);
  }

  public async fetchCreatePol(_newPolModel: WaifuPol) {
    const json = JSON.stringify(_newPolModel, MapSerializationFixes.replacer);
    const res = await fetch(this._baseApiUrl, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      body: json,
    });

    if (!res.ok) throw new Error(await res.text());
  }

  public async fetchRemovePol(pol: WaifuPol) {
    const res = await fetch(this._baseApiUrl, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "delete",
      body: JSON.stringify({
        title: pol.title,
      }),
    });

    if (!res.ok) throw new Error(await res.text());
  }

  public async fetchUpdatePol(pol: WaifuPol) {
    const res = await fetch(this._baseApiUrl, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "put",
      body: JSON.stringify(
        {
          title: pol.title,
          options: pol.options,
        },
        MapSerializationFixes.replacer,
      ),
    });

    if (!res.ok) throw new Error(await res.text());
  }
}
