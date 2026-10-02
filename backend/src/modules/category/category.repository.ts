import { prisma } from "../../lib/prisma.js";
import { ICategoryRepository } from "./category.interface.js";
import { updateCategoryDTO } from "./category.schema.js";

export class CategoryRepository implements ICategoryRepository {
  async createCategory(data: {
    categoryName: string;
    categoryDescription: string;
  }) {
    const category = await prisma.category.create({ data });
    return category;
  }

  async updateCategory(categoryId: string, data: updateCategoryDTO) {
    const category = await prisma.category.update({
      where: { id: categoryId },
      data,
    });

    return category;
  }

  async findCategoryById(categoryId: string) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    return category;
  }

  async findCategoryByName(categoryName: string) {
    const category = await prisma.category.findUnique({
      where: { categoryName },
    });
    return category;
  }

  async deleteCategory(categoryId: string) {
    await prisma.category.delete({ where: { id: categoryId } });
    return true;
  }

  async findAllCategories() {
    const categories = await prisma.category.findMany();
    return categories;
  }
}
