import { Request, Response } from "express";
import { CatchAsync } from "../../utils/CatchAsync.js";
import { categoryService } from "./category.container.js";
import { sendResponse } from "../../utils/sendResponse.js";

export const createCategoryController = CatchAsync(
  async (req: Request, res: Response) => {
    const result = await categoryService.createCategory(req.body);

    sendResponse(res, 201, {
      success: true,
      message: "Category created successfully",
      data: result,
    });
  },
);

export const getCategoryByIdController = CatchAsync(
  async (req: Request, res: Response) => {
    const categoryId = req.params.id as string;
    const result = await categoryService.getCategoryById(categoryId);

    sendResponse(res, 200, {
      success: true,
      message: "Category fetched successfully",
      data: result,
    });
  },
);
