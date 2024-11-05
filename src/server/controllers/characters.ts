import { controller, route } from "@server/decorators/routing";
import { Request, Response, NextFunction } from "express";

@controller("/api/chars")
export class CharactersController {
  @route("get", "")
  public getCharacterInfo(req: Request, res: Response, next: NextFunction) {
    return res.status(200).json({ message: "test response" });
  }
}
