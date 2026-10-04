import redis from "../../lib/redis.js";
import { AppError } from "../../utils/AppError.js";
import { invalidateCategoryCache } from "../../utils/cache.helper.js";
import { IProductRepository } from "../product/product.interface.js";
import { ICategoryRepository } from "./category.interface.js";
import {
  toCategoriesListResponse,
  toCategoryResponse,
} from "./category.mapper.js";
import { createCategoryDTO, updateCategoryDTO } from "./category.schema.js";

export class CategoryService {
  constructor(
    private categoryRepo: ICategoryRepository,
    private productRepo: IProductRepository,
  ) {}

  async createCategory(data: createCategoryDTO) {
    const existingName = await this.categoryRepo.findCategoryByName(
      data.categoryName,
    );

    if (existingName) {
      throw new AppError("Category with this name already exist", 400);
    }

    const newCategory = await this.categoryRepo.createCategory(data);
    await invalidateCategoryCache();
    return toCategoryResponse(newCategory);
  }

  async updateCategory(categoryId: string, data: updateCategoryDTO) {
    const isCategoryExist =
      await this.categoryRepo.findCategoryById(categoryId);

    if (!isCategoryExist) {
      throw new AppError("Category not exist", 404);
    }

    if (data?.categoryName) {
      const duplicate = await this.categoryRepo.findCategoryByName(
        data.categoryName,
      );

      if (duplicate && duplicate.id !== categoryId) {
        throw new AppError("Category with this name already exist", 400);
      }
    }

    const updatedCategory = await this.categoryRepo.updateCategory(
      categoryId,
      data,
    );

    await invalidateCategoryCache();
    return toCategoryResponse(updatedCategory);
  }

  async getCategoryById(categoryId: string) {
    const category = await this.categoryRepo.findCategoryById(categoryId);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    return toCategoryResponse(category);
  }

  async deleteCategory(categoryId: string) {
    const isExisting = await this.categoryRepo.findCategoryById(categoryId);

    if (!isExisting) {
      throw new AppError("Category not found", 404);
    }

    const categoryProducts =
      await this.productRepo.findProductsByCategoryId(categoryId);

    if (categoryProducts.length > 0) {
      throw new AppError(
        "Can't delete category, Products associated to this category.",
        400,
      );
    }

    await this.categoryRepo.deleteCategory(categoryId);
    await invalidateCategoryCache();
    return true;
  }

  async getAllCategories() {
    const cacheKey = `categories:all`;
    const cachedCategories = await redis.get(cacheKey);

    if (cachedCategories) {
      return JSON.parse(cachedCategories);
    }

    const categories = await this.categoryRepo.findAllCategories();
    const formattedCategories = toCategoriesListResponse(categories);
    await redis.set(cacheKey, JSON.stringify(formattedCategories), "EX", 300);
    return formattedCategories;
  }
}
