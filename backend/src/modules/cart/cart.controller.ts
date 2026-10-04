import { Request, Response } from "express";
import { CatchAsync } from "../../utils/CatchAsync.js";
import { cartService } from "./cart.container.js";
import { sendResponse } from "../../utils/sendResponse.js";

export const addToCartController = CatchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id as string;
    const result = await cartService.addToCart(userId, req.body);

    sendResponse(res, 201, {
      success: true,
      message: "Item added to your cart",
      data: result,
    });
  },
);

export const getMyCartController = CatchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id as string;
    const result = await cartService.getMyCart(userId);

    sendResponse(res, 200, {
      success: true,
      message: "Cart fetched successfully",
      data: result,
    });
  },
);

export const updateCartItemQuantityController = CatchAsync(
  async (req: Request, res: Response) => {
    const cartItemId = req.params.itemId as string;
    const result = await cartService.updateCartItemQuantity(
      cartItemId,
      req.body,
    );

    sendResponse(res, 201, {
      success: true,
      message: "Cart item quantity updated",
      data: result,
    });
  },
);

export const removeCartItemController = CatchAsync(
  async (req: Request, res: Response) => {
    const cartItemId = req.params.itemId as string;
    const result = await cartService.removeCartItem(cartItemId);

    sendResponse(res, 201, {
      success: true,
      message: "Cart item removed successfully",
    });
  },
);

export const clearCartController = CatchAsync(
  async (req: Request, res: Response) => {
    const cartId = req.params.id as string;
    const userId = req.user.id as string;
    const result = await cartService.clearCart(userId, cartId);

    sendResponse(res, 201, {
      success: true,
      message: "Cart cleared successfully",
    });
  },
);
