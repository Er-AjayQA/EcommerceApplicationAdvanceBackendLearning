import { Category } from "../../generated/prisma/client.js";

export interface ICategoryRepository {
  createCategory(data: {
    categoryName: string;
    categoryDescription: string;
  }): Promise<Category>;

  findCategoryById(categoryId: string): Promise<Category | null>;
  findCategoryByName(categoryName: string): Promise<Category | null>;

  deleteCategory(categoryId: string): Promise<boolean>;
}
