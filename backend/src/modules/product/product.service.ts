import { AppError } from "../../utils/AppError.js";
import { uploadToCloudinary } from "../../utils/cloudinary/cloudinary.helper.js";
import { ICategoryRepository } from "../category/category.interface.js";
import { IProductRepository } from "./product.interface.js";
import { toProductResponse } from "./product.mapper.js";
import { createProductDTO } from "./product.schema.js";

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
}
