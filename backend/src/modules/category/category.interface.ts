import { Category } from "../../generated/prisma/client.js";
import { updateCategoryDTO } from "./category.schema.js";

export interface ICategoryRepository {
  createCategory(data: {
    categoryName: string;
    categoryDescription: string;
  }): Promise<Category>;

  updateCategory(
    categoryId: string,
    data: updateCategoryDTO,
  ): Promise<Category>;

  deleteCategory(categoryId: string): Promise<boolean>;

  findAllCategories(): Promise<Category[] | []>;
  findCategoryById(categoryId: string): Promise<Category | null>;
  findCategoryByName(categoryName: string): Promise<Category | null>;
}
