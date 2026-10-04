import { Prisma } from "../../generated/prisma/client.js";
import { ProductQueryOptions } from "../../types/index.js";

export const generateProductWhereCondition = (filters: ProductQueryOptions) => {
  const { categoryId, minPrice, maxPrice } = filters;

  const where: Prisma.ProductWhereInput = {
    isActive: true,
  };

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (minPrice || maxPrice) {
    where.price = {};

    if (minPrice) {
      where.price.gte = new Prisma.Decimal(minPrice);
    }

    if (maxPrice) {
      where.price.lte = new Prisma.Decimal(maxPrice);
    }
  }

  return where;
};

export const generateProductSortingCondition = (sortBy: string) => {
  let orderBy: Prisma.ProductOrderByWithRelationInput = {
    createdAt: "desc",
  };

  switch (sortBy) {
    case "latest":
      orderBy = { createdAt: "desc" };
      break;

    case "oldest":
      orderBy = { createdAt: "asc" };
      break;

    case "priceAsc":
      orderBy = { price: "asc" };
      break;

    case "priceDesc":
      orderBy = { price: "desc" };
      break;
  }

  return orderBy;
};
