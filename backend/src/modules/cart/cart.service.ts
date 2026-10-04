import { Prisma } from "../../generated/prisma/client.js";
import { AppError } from "../../utils/AppError.js";
import { IProductRepository } from "../product/product.interface.js";
import { ICartRepository } from "./cart.interface.js";
import { addToCartDTO, updateCartItemDTO } from "./cart.schema.js";

export class CartService {
  constructor(
    private cartRepo: ICartRepository,
    private productRepo: IProductRepository,
  ) {}

  async addToCart(userId: string, data: addToCartDTO) {
    const { productId, quantity } = data;

    if (quantity <= 0) {
      throw new AppError("Quantity must be greater than 0", 400);
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

    return await this.cartRepo.addItemToCart(cart.id, data);
  }

  async getMyCart(userId: string) {
    const myCart = await this.cartRepo.findCartWithItems(userId);

    let totalItems = 0;
    let totalPrice = new Prisma.Decimal(0);

    if (!myCart) {
      return {
        item: [],
        totalPrice,
        totalItems,
      };
    }

    const formattedItems = myCart.items.map((item) => {
      const isAvailable = item.product.isActive;
      let itemTotal = new Prisma.Decimal(0);

      if (isAvailable) {
        itemTotal = item.product.price.mul(item.quantity);
        totalPrice = totalPrice.add(itemTotal);
        totalItems += item.quantity;
      }

      return {
        ...item,
        itemTotal,
        isAvailable,
      };
    });

    return {
      id: myCart.id,
      items: formattedItems,
      userId: myCart.userId,
      totalItems,
      totalPrice,
    };
  }

  async updateCartItemQuantity(cartItemId: string, data: updateCartItemDTO) {
    const { quantity } = data;

    const existingCartItem = await this.cartRepo.findCartItem(cartItemId);

    if (!existingCartItem) {
      throw new AppError("Cart item not found", 404);
    }

    if (quantity <= 0) {
      await this.cartRepo.removeCartItems(cartItemId);
      return null;
    }

    if (!existingCartItem.product.isActive) {
      throw new AppError("Product not available", 400);
    }

    if (existingCartItem.product.stock < quantity) {
      throw new AppError("Insufficient stock", 400);
    }

    const cartItem = await this.cartRepo.updateCartItemQuantity(
      cartItemId,
      quantity,
    );

    return cartItem;
  }

  async removeCartItem(cartItemId: string) {
    const cartItem = await this.cartRepo.findCartItem(cartItemId);

    if (!cartItem) {
      throw new AppError("Cart item not found", 404);
    }

    await this.cartRepo.removeCartItems(cartItemId);
    return true;
  }

  async clearCart(userId: string, cartId: string) {
    const cart = await this.cartRepo.findCartByUserId(userId);

    if (!cart) {
      throw new AppError("Cart not found", 404);
    }

    await this.cartRepo.clearCart(cartId);
    return true;
  }
}
