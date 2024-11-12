import { controller, route } from "@server/decorators/routing";
import { GenshinApiService } from "@server/services/genshinApi";
import { ImageProcessor } from "@server/services/imageProcessor";
import { Request, Response } from "express";
import { singleton } from "tsyringe";

@singleton()
@controller("/api")
export class DefaultController {
  constructor(private readonly _api: GenshinApiService) {}

  @route("get", "/")
  public getHealth(
    req: Request,
    res: Response,
    // next: NewableFunction
  ) {
    return res.status(200).json({ status: "Working" });
  }

  @route("get", "/princess")
  public async getKeqingOpulent(
    req: Request,
    res: Response,
    // next: NewableFunction
  ) {
    const blob = await this._api.fetchCharacterMedia(
      "outfit-opulent-splendor",
      "keqing",
    );
    const optimizer = new ImageProcessor();
    const optimized = await optimizer.blobToBuffer(blob);
    return res.status(200).type("image/png").send(optimized);
  }
}
