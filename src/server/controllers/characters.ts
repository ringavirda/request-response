import { controller, route } from "@server/decorators/routing";
import { GenshinApiService } from "@server/services/genshinApi";
import { ImageProcessor } from "@server/services/imageProcessor";
import { Request, Response } from "express";
import { inject, singleton } from "tsyringe";

@singleton()
@controller("/api/chars")
export class CharactersController {
  constructor(
    @inject(GenshinApiService) private readonly _api: GenshinApiService,
  ) {}

  @route("get", "/")
  public async getCharacterList(
    req: Request,
    res: Response,
    // next: NextFunction,
  ) {
    try {
      const waifus = await this._api.fetchCharacterList();
      return res.status(200).json(waifus);
    } catch (err: unknown) {
      return res.status(400).json({ badRequest: (err as Error).message });
    }
  }

  @route("get", "/:id")
  public async getCharacterInfo(
    req: Request,
    res: Response,
    // next: NextFunction,
  ) {
    try {
      const char = await this._api.fetchCharacter(req.params.id);
      return res.status(200).json(char);
    } catch (err: unknown) {
      return res.status(400).json({ badRequest: (err as Error).message });
    }
  }

  @route("get", "/:id/portrait")
  public async getCharacterPortrait(
    req: Request,
    res: Response,
    // next: NextFunction,
  ) {
    try {
      const blob = await this._api.fetchCharacterPortrait(req.params.id);

      const resizeHeight = parseInt(req.query.height as string);
      const resizeWidth = parseInt(req.query.width as string);
      const optimizer = new ImageProcessor();
      const optimized = await optimizer.processBlob(
        blob,
        isNaN(resizeHeight) ? undefined : resizeHeight,
        isNaN(resizeWidth) ? undefined : resizeWidth,
      );

      return res.status(200).type("image/jpeg").send(optimized);
    } catch (err: unknown) {
      return res.status(400).json({ badRequest: (err as Error).message });
    }
  }

  @route("get", "/:id/card")
  public async getCharacterCard(
    req: Request,
    res: Response,
    // next: NextFunction,
  ) {
    try {
      const blob = await this._api.fetchCharacterCard(req.params.id);

      const resizeHeight = parseInt(req.query.height as string);
      const resizeWidth = parseInt(req.query.width as string);
      const optimizer = new ImageProcessor();
      const optimized = await optimizer.processBlob(
        blob,
        isNaN(resizeHeight) ? undefined : resizeHeight,
        isNaN(resizeWidth) ? undefined : resizeWidth,
      );

      return res.status(200).type("image/jpeg").send(optimized);
    } catch (err: unknown) {
      return res.status(400).json({ badRequest: (err as Error).message });
    }
  }

  @route("get", "/:id/icon")
  public async getCharacterIcon(
    req: Request,
    res: Response,
    // next: NextFunction,
  ) {
    try {
      let iconType = req.query.type;
      if (iconType === undefined) iconType = "";

      const blob = await this._api.fetchCharacterIcon(
        req.params.id,
        iconType as string,
      );
      const optimizer = new ImageProcessor();
      const icon = await optimizer.blobToBuffer(blob);

      return res.status(200).type("image/png").send(icon);
    } catch (err: unknown) {
      return res.status(400).json({ badRequest: (err as Error).message });
    }
  }
}
