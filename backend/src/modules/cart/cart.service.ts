import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.js";
import { IProductRepository } from "../product/product.interface.js";
import { ICartRepository } from "./cart.interface.js";
import { createCartDTO } from "./cart.schema.js";

export class CartService {
  constructor(
    private cartRepo: ICartRepository,
    private productRepo: IProductRepository,
  ) {}

  async addToCart(userId: string, productId: string, quantity: number) {
    if (quantity <= 0) {
      throw new AppError("Quantity must be greater than 1", 400);
    }

    let cart = await this.cartRepo.findCartByUserId(userId);

    if (!cart) {
      cart = await this.cartRepo.createCart(userId);
    }

    const product = await this.productRepo.findProductById(productId);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (product.stock <= quantity) {
      throw new AppError("Insufficient stock", 400);
    }

    if (!product.isActive) {
      throw new AppError("Product not available", 400);
    }

    return await this.cartRepo.addItemsToCart(cart.id, productId, quantity);
  }
}
