import { Prisma } from "../../generated/prisma/client.js";
import { AppError } from "../../utils/AppError.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/cloudinary/cloudinary.helper.js";
import { ICategoryRepository } from "../category/category.interface.js";
import { IProductRepository } from "./product.interface.js";
import { toProductResponse, toProductsListResponse } from "./product.mapper.js";
import { createProductDTO, updateProductDTO } from "./product.schema.js";

export class ProductService {
  constructor(
    private productRepo: IProductRepository,
    private categoryRepo: ICategoryRepository,
  ) {}

  async createProduct(
    userId: string,
    data: createProductDTO,
    files: Express.Multer.File[],
  ) {
    const isCategoryExist = await this.categoryRepo.findCategoryById(
      data.categoryId,
    );

    if (!isCategoryExist) {
      throw new AppError("Category not exist", 404);
    }

    if (!files || files.length === 0) {
      throw new AppError("Atleast one product image is required", 400);
    }

    const imageUrls = await Promise.all(
      files.map((file) => uploadToCloudinary(file.buffer)),
    );

    const newProduct = await this.productRepo.createProduct({
      userId,
      categoryId: data.categoryId,
      productName: data.productName,
      productDescription: data.productDescription,
      productImagesUrls: imageUrls,
      price: parseFloat(data.price),
      stock: Number(data.stock),
    });

    return toProductResponse(newProduct);
  }

  async updateProduct(
    productId: string,
    sellerId: string,
    data: updateProductDTO,
    files: Express.Multer.File[],
  ) {
    const isExistingProduct = await this.productRepo.findProductByIdAndSellerId(
      productId,
      sellerId,
    );

    if (!isExistingProduct) {
      throw new AppError(
        "Product not found or your are not authorized for this action",
        401,
      );
    }

    const updateData: Prisma.ProductUncheckedUpdateInput = {};

    if (data.categoryId !== undefined) {
      updateData.categoryId = data.categoryId;
    }

    if (data.productName !== undefined) {
      updateData.productName = data.productName;
    }

    if (data.productDescription !== undefined) {
      updateData.productDescription = data.productDescription;
    }

    if (data.price !== undefined) {
      updateData.price = parseFloat(data.price);
    }

    if (data.stock !== undefined) {
      updateData.stock = Number(data.stock);
    }

    // Image Handling
    const isImageUpdateRequested =
      data.keepImageUrls !== undefined || (files && files.length > 0);

    if (isImageUpdateRequested) {
      const oldImages = isExistingProduct.productImagesUrls ?? [];
      const keepImages = data.keepImageUrls ?? oldImages;
      const invalidKeeps = keepImages.filter((url) => !oldImages.includes(url));
      let newImageUrls: string[] = [];

      if (invalidKeeps.length > 0) {
        throw new AppError("Invalid image URLs in keepImageUrls", 400);
      }

      if (files && files.length > 0) {
        newImageUrls = await Promise.all(
          files.map((file) => uploadToCloudinary(file.buffer)),
        );
      }

      updateData.productImagesUrls = [...keepImages, ...newImageUrls];

      const removedImages = oldImages.filter(
        (url) => !keepImages.includes(url),
      );

      if (removedImages.length > 0) {
        await Promise.allSettled(
          removedImages.map((url) => deleteFromCloudinary(url)),
        );
      }
    }

    if (Object.keys(updateData).length === 0) {
      throw new AppError("No valid fields provided", 400);
    }

    const updatedProduct = await this.productRepo.updateProduct(
      productId,
      sellerId,
      updateData,
    );
    return toProductResponse(updatedProduct);
  }

  async deleteProduct(productId: string, sellerId: string) {
    const isExistingProduct = await this.productRepo.findProductByIdAndSellerId(
      productId,
      sellerId,
    );

    if (!isExistingProduct) {
      throw new AppError(
        "Product not found or you are not authorized for this action",
        401,
      );
    }

    await Promise.allSettled(
      isExistingProduct.productImagesUrls.map((imageUrl) =>
        deleteFromCloudinary(imageUrl),
      ),
    );

    await this.productRepo.deleteProductById(productId, sellerId);
  }

  async toggleProductStatus(productId: string, sellerId: string) {
    const isExistingProduct = await this.productRepo.findProductByIdAndSellerId(
      productId,
      sellerId,
    );

    if (!isExistingProduct) {
      throw new AppError(
        "Product not found or you are not authorized for this action",
        401,
      );
    }

    const updatedProduct = await this.productRepo.toggleProductStatus(
      productId,
      sellerId,
      !isExistingProduct.isActive,
    );

    return toProductResponse(updatedProduct);
  }

  async getAllProducts() {
    const products = await this.productRepo.findAllProducts();
    return toProductsListResponse(products);
  }

  async getProductsByCategoryId(categoryId: string) {
    const products =
      await this.productRepo.findProductsByCategoryId(categoryId);
    return toProductsListResponse(products);
  }

  async getAllActiveProducts() {
    const activeProducts = await this.productRepo.findAllActiveProducts();
    return toProductsListResponse(activeProducts);
  }
}
