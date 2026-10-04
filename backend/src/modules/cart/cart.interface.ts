import { Cart, CartItems } from "../../generated/prisma/client.js";
import { CartItemWithProduct, CartWithItems } from "../../types/index.js";
import { addToCartDTO } from "./cart.schema.js";

export interface ICartRepository {
  findCartByUserId(userId: string): Promise<Cart | null>;
  findCartWithItems(userId: string): Promise<CartWithItems | null>;
  findCartItem(cartItemId: string): Promise<CartItemWithProduct | null>;

  createCart(userId: string): Promise<Cart>;

  addItemToCart(cartId: string, data: addToCartDTO): Promise<CartItems>;

  updateCartItemQuantity(
    cartItemId: string,
    quantity: number,
  ): Promise<CartItems>;

  removeCartItems(cartItemId: string): Promise<void>;
  clearCart(cartId: string): Promise<void>;
}
