import { AppError } from "../../utils/AppError.js";
import { ICategoryRepository } from "./category.interface.js";
import { toCategoryResponse } from "./category.mapper.js";
import { createCategoryDTO } from "./category.schema.js";

export class CategoryService {
  constructor(private categoryRepo: ICategoryRepository) {}

  async createCategory(data: createCategoryDTO) {
    const existingName = await this.categoryRepo.findCategoryByName(
      data.categoryName,
    );

    if (existingName) {
      throw new AppError("Category with this name already exist", 400);
    }

    const newCategory = await this.categoryRepo.createCategory(data);
    return toCategoryResponse(newCategory);
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
      throw new AppError("Categpry not found", 404);
    }

    await this.categoryRepo.deleteCategory(categoryId);
    return true;
  }
}
