import { Cart, CartItems } from "../../generated/prisma/client.js";

export interface ICartRepository {
  findCartByUserId(userId: string): Promise<Cart | null>;
  findCartWithItems(userId: string): Promise<Cart | null>;

  createCart(userId: string): Promise<Cart>;

  addItemsToCart(
    cartId: string,
    productId: string,
    quantity: number,
  ): Promise<CartItems>;

  updateCartItemQuantity(
    cartItemId: string,
    quantity: number,
  ): Promise<CartItems>;

  removeCartItems(cartItemId: string): Promise<void>;
  clearCart(cartId: string): Promise<void>;
}
