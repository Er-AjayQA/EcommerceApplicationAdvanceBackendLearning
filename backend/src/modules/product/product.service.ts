import { AppError } from "../../utils/AppError.js";
import { uploadToCloudinary } from "../../utils/cloudinary/cloudinary.helper.js";
import { IProductRepository } from "./product.interface.js";
import { toProductResponse } from "./product.mapper.js";
import { createProductDTO } from "./product.schema.js";

export class ProductService {
  constructor(private productRepo: IProductRepository) {}

  async createProduct(
    userId: string,
    data: createProductDTO,
    files: Express.Multer.File[],
  ) {
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
