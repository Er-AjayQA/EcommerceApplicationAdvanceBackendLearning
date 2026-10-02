import { Product } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
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

  async deleteProductsByCategory(categoryId: string) {
    await prisma.product.deleteMany({ where: { categoryId } });
    return true;
  }

  async findProductsByCategoryId(categoryId: string) {
    const products = await prisma.product.findMany({ where: { categoryId } });
    return products;
  }
}
