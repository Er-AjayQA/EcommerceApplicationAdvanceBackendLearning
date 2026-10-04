import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { ProductQueryOptions } from "../../types/index.js";
import { IProductRepository } from "./product.interface.js";

export class ProductRepository implements IProductRepository {
  async createProduct(data: {
    userId: string;
    categoryId: string;
    productName: string;
    productDescription: string;
    productImagesUrls: string[];
    price: any;
    stock: number;
  }) {
    const product = await prisma.product.create({ data });
    return product;
  }

  async updateProduct(
    productId: string,
    sellerId: string,
    data: Prisma.ProductUncheckedUpdateInput,
  ) {
    const updatedProduct = await prisma.product.update({
      where: { id: productId, userId: sellerId },
      data,
    });
    return updatedProduct;
  }

  async deleteProductsByCategory(categoryId: string) {
    await prisma.product.deleteMany({ where: { categoryId } });
    return true;
  }

  async deleteProductById(productId: string, sellerId: string) {
    await prisma.product.delete({ where: { id: productId, userId: sellerId } });
    return true;
  }

  async toggleProductStatus(
    productId: string,
    sellerId: string,
    status: boolean,
  ) {
    const product = await prisma.product.update({
      where: { id: productId, userId: sellerId },
      data: {
        isActive: status,
      },
    });

    return product;
  }

  async findAllProducts(filters: ProductQueryOptions) {
    const {
      categoryId,
      minPrice,
      maxPrice,
      sortBy,
      limit = 10,
      cursor,
    } = filters;

    // Filter Logic
    const where: Prisma.ProductWhereInput = {};

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

    if (cursor) {
      where.createdAt = {
        lt: new Date(cursor),
      };
    }

    // Sorting Logic
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

    const products = await prisma.product.findMany({
      where,
      orderBy,
      take: limit + 1,
    });

    let nextCursor: string | null = null;

    if (products.length > limit) {
      const nextItem = products.pop();
      nextCursor = nextItem?.createdAt.toISOString() || null;
    }

    return { products, nextCursor, hasMore: !!nextCursor };
  }

  async findProductById(productId: string) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    return product;
  }

  async findProductsByCategoryId(categoryId: string) {
    const products = await prisma.product.findMany({
      where: { categoryId },
    });
    return products;
  }

  async findProductByIdAndSellerId(productId: string, sellerId: string) {
    const product = await prisma.product.findFirst({
      where: { id: productId, userId: sellerId },
    });
    return product;
  }

  async findAllActiveProducts(filters: ProductQueryOptions) {
    const {
      categoryId,
      minPrice,
      maxPrice,
      sortBy,
      limit = 10,
      cursor,
    } = filters;

    // Filters Logic
    const where: Prisma.ProductWhereInput = { isActive: true };

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

    if (cursor) {
      where.createdAt = { lt: new Date(cursor) };
    }

    // Sorting Logic
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

    const products = await prisma.product.findMany({
      where,
      orderBy,
      take: limit + 1,
    });

    let nextCursor: string | null = null;

    if (products.length > limit) {
      const nextItem = products.pop();
      nextCursor = nextItem?.createdAt.toISOString() || null;
    }

    return { products, nextCursor, hasMore: !!nextCursor };
  }
}
