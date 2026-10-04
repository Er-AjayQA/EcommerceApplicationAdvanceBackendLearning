import { gte } from "zod";
import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { ProductQueryOptions } from "../../types/index.js";
import { IProductRepository } from "./product.interface.js";
import {
  generateProductSortingCondition,
  generateProductWhereCondition,
} from "./product.helper.js";

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
    const { sortBy } = filters;

    const whereCondition = generateProductWhereCondition(filters);
    const sortingCondition = generateProductSortingCondition(sortBy as string);

    const products = await prisma.product.findMany({
      where: whereCondition,
      orderBy: sortingCondition,
    });
    return products;
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
    const { sortBy } = filters;

    const whereCondition = generateProductWhereCondition(filters);
    const sortingCondition = generateProductSortingCondition(sortBy as string);

    const products = await prisma.product.findMany({
      where: whereCondition,
      orderBy: sortingCondition,
    });

    return products;
  }
}
