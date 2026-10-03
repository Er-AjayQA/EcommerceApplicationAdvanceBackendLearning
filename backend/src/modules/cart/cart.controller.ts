import { Request, Response } from "express";
import { CatchAsync } from "../../utils/CatchAsync.js";

export const createCart = CatchAsync(async (req: Request, res: Response) => {
  const userId = req.user.is as string;
});
