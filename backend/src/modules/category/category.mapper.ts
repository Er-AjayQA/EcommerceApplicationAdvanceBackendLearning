import { Category } from "../../generated/prisma/client.js";
import { categoryResponseDTO } from "./category.response.js";

export const toCategoryResponse = (category: Category): categoryResponseDTO => {
  return {
    id: category.id,
    categoryName: category.categoryName,
    categoryDescription: category.categoryDescription,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
};
