import { Request, Response } from "express";
import { CatchAsync } from "../../utils/CatchAsync.js";
import { productService } from "./product.container.js";
import { sendResponse } from "../../utils/sendResponse.js";

export const createProductController = CatchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const files = req.files;
    const result = await productService.createProduct(
      userId,
      req.body,
      files as Express.Multer.File[],
    );

    sendResponse(res, 201, {
      success: true,
      message: "Product created successfully",
      data: result,
    });
  },
);

export const updateProductController = CatchAsync(
  async (req: Request, res: Response) => {
    const productId = req.params.id as string;
    const sellerId = req.user.id as string;
    const result = await productService.updateProduct(
      productId,
      sellerId,
      req.body,
      req.files as Express.Multer.File[],
    );

    sendResponse(res, 201, {
      success: true,
      message: "Product updated successfully",
      data: result,
    });
  },
);

export const deleteProductController = CatchAsync(
  async (req: Request, res: Response) => {
    const productId = req.params.id as string;
    const sellerId = req.user.id as string;

    await productService.deleteProduct(productId, sellerId);

    sendResponse(res, 200, {
      success: true,
      message: "Product deleted successfully",
    });
  },
);

export const toggleProductStatusController = CatchAsync(
  async (req: Request, res: Response) => {
    const productId = req.params.id as string;
    const sellerId = req.user.id as string;

    const result = await productService.toggleProductStatus(
      productId,
      sellerId,
    );

    sendResponse(res, 201, {
      success: true,
      message: "Status changed successfully",
      data: result,
    });
  },
);

export const getAllProductsController = CatchAsync(
  async (req: Request, res: Response) => {
    const filters = {
      categoryId: req.query.categoryId as string,
      minPrice: req.query.minPrice as string,
      maxPrice: req.query.maxPrice as string,
      sortBy: req.query.query as "latest" | "oldest" | "priceAsc" | "priceDesc",

      limit: req.query.limit ? Number(req.query.limit) : 3,
      cursor: req.query.cursor as string,
    };

    const result = await productService.getAllProducts(filters);

    sendResponse(res, 200, {
      success: true,
      message: "Products fetched successfully",
      data: result,
    });
  },
);

export const getProductsByCategoryController = CatchAsync(
  async (req: Request, res: Response) => {
    const categoryId = req.params.catId as string;
    const result = await productService.getProductsByCategoryId(categoryId);

    sendResponse(res, 200, {
      success: true,
      message: "Products fetched successfully",
      data: result,
    });
  },
);

export const getAllActiveProductsController = CatchAsync(
  async (req: Request, res: Response) => {
    const filters = {
      categoryId: req.query.categoryId as string,
      minPrice: req.query.minPrice as string,
      maxPrice: req.query.maxPrice as string,
      sortBy: req.query.query as "latest" | "oldest" | "priceAsc" | "priceDesc",

      limit: req.query.limit ? Number(req.query.limit) : 10,
      cursor: req.query.cursor as string,
    };

    const result = await productService.getAllActiveProducts(filters);

    sendResponse(res, 200, {
      success: true,
      message: "Fetched active products",
      data: result,
    });
  },
);
