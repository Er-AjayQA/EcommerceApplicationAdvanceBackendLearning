import { Product } from "../../generated/prisma/client.js";

export interface IProductRepository {
  createProduct(data: {
    userId: string;
    categoryId: string;
    productName: string;
    productDescription: string;
    productImagesUrls: string[];
    price: any;
    stock: number;
  }): Promise<Product>;
}
