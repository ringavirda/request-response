import { controller, route } from "@server/decorators/routing";
import { Request, Response } from "express";

@controller("/api")
export class DefaultController {
  @route("get", "/")
  public getHealth(
    req: Request,
    res: Response,
    // next: NewableFunction
  ) {
    return res.status(200).json({ status: "Working" });
  }
}
