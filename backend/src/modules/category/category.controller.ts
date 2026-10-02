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

export const updateCategoryController = CatchAsync(
  async (req: Request, res: Response) => {
    const categoryId = req.params.id as string;
    const result = await categoryService.updateCategory(categoryId, req.body);

    sendResponse(res, 201, {
      success: true,
      message: "Category updated successfully",
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

export const deleteCategoryController = CatchAsync(
  async (req: Request, res: Response) => {
    const categoryId = req.params.id as string;
    const isDeleted = await categoryService.deleteCategory(categoryId);

    sendResponse(res, 200, {
      success: true,
      message: "Category deleted successfully",
    });
  },
);

export const getAllCategoriesController = CatchAsync(
  async (req: Request, res: Response) => {
    const result = await categoryService.getAllCategories();

    sendResponse(res, 200, {
      success: true,
      message: "Fetched all categories successfully",
      data: result,
    });
  },
);
