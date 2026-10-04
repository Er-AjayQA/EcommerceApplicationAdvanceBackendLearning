import { prisma } from "../../lib/prisma.js";
import { ICartRepository } from "./cart.interface.js";
import { addToCartDTO } from "./cart.schema.js";

export class CartRepository implements ICartRepository {
  async findCartByUserId(userId: string) {
    const userCart = await prisma.cart.findUnique({
      where: { userId },
    });

    return userCart;
  }

  async findCartWithItems(userId: string) {
    const userCart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
    return userCart;
  }

  async findCartItem(cartItemId: string) {
    const cartItemWithProduct = await prisma.cartItems.findUnique({
      where: { id: cartItemId },
      include: { product: true },
    });

    return cartItemWithProduct;
  }

  async createCart(userId: string) {
    const cart = await prisma.cart.create({ data: { userId } });
    return cart;
  }

  async addItemToCart(cartId: string, data: addToCartDTO) {
    const { productId, quantity } = data;

    const existingItem = await prisma.cartItems.findUnique({
      where: { cartId_productId: { cartId, productId } },
    });

    if (existingItem) {
      return await prisma.cartItems.update({
        where: { id: existingItem.id },
        data: {
          quantity: {
            increment: quantity,
          },
        },
      });
    }

    return await prisma.cartItems.create({
      data: {
        cartId,
        productId,
        quantity,
      },
    });
  }

  async updateCartItemQuantity(cartItemId: string, quantity: number) {
    const updatedCartItem = await prisma.cartItems.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    return updatedCartItem;
  }

  async removeCartItems(cartItemId: string) {
    await prisma.cartItems.delete({ where: { id: cartItemId } });
  }

  async clearCart(cartId: string) {
    await prisma.cart.delete({ where: { id: cartId } });
  }
}
