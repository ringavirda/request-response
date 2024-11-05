import { controller, route } from "@server/decorators/routing";
import { Request, Response, RequestHandler } from "express";

@controller("/api")
export class DefaultController {
  @route("get", "/")
  public getHealth(req: Request, res: Response, next: RequestHandler) {
    return res.status(200).json({ status: "Working" });
  }
}
