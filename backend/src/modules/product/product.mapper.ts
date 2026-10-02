import { Product } from "../../generated/prisma/client.js";

export const toProductResponse = (product: Product) => {
  return {
    id: product.id,
    userId: product.userId,
    categoryId: product.categoryId,
    productName: product.productName,
    productDescription: product.productDescription,
    productImagesUrls: product.productImagesUrls,
    price: product.price,
    stock: product.stock,
    rating: product.rating,
    isActive: product.isActive,
    createAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
};

export const toProductsListResponse = (products: Product[]) => {
  return products.map(toProductResponse);
};
