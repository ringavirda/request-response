import { Request, Response } from "express";

import { controller, ControllerBase, route } from "@server/framework";
import { GenshinApi } from "@server/services/genshinApi";
import { ImageProcessor } from "@server/services/imageProcessor";
import { container } from "tsyringe";

@controller("/api")
export class DefaultController extends ControllerBase {
  constructor(private readonly _api: GenshinApi) {
    super();
  }

  @route("get", "/")
  public getHealth(
    req: Request,
    res: Response,
    // next: NextFunction
  ) {
    return this.ok(res, { status: "Working" });
  }

  @route("get", "/princess")
  public async getKeqingOpulent(
    req: Request,
    res: Response,
    // next: NextFunction
  ) {
    const blob = await this._api.fetchCharacterMedia(
      "outfit-opulent-splendor",
      "keqing",
    );
    const optimizer = new ImageProcessor();
    const optimized = await optimizer.blobToBuffer(blob);

    return this.ok(res, optimized, "image/png");
  }

  public static async preloadPrincess() {
    const api = container.resolve(GenshinApi);
    await api.fetchCharacterMedia("outfit-opulent-splendor", "keqing");
  }
}
