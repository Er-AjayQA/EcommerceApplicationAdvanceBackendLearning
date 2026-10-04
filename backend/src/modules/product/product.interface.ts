import { Prisma, Product } from "../../generated/prisma/client.js";
import { ProductQueryOptions } from "../../types/index.js";

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

  updateProduct(
    productId: string,
    sellerId: string,
    data: Prisma.ProductUncheckedUpdateInput,
  ): Promise<Product>;

  deleteProductsByCategory(categoryId: string): Promise<boolean>;
  deleteProductById(productId: string, sellerId: string): Promise<boolean>;

  toggleProductStatus(
    productId: string,
    sellerId: string,
    status: boolean,
  ): Promise<Product>;

  findAllProducts(filters: ProductQueryOptions): Promise<{
    products: Product[];
    nextCursor: string | null;
    hasMore: boolean;
  }>;
  findProductById(productId: string): Promise<Product | null>;
  findProductsByCategoryId(categoryId: string): Promise<Product[] | []>;
  findProductByIdAndSellerId(
    productId: string,
    sellerId: string,
  ): Promise<Product | null>;
  findAllActiveProducts(filters: ProductQueryOptions): Promise<{
    products: Product[];
    nextCursor: string | null;
    hasMore: boolean;
  }>;
}
