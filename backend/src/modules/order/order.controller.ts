import { Request, Response } from "express";
import { CatchAsync } from "../../utils/CatchAsync.js";
import { orderService } from "./order.container.js";
import { sendResponse } from "../../utils/sendResponse.js";

export const createOrderController = CatchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id as string;
    const result = await orderService.createOrder(userId, req.body);

    sendResponse(res, 201, {
      success: true,
      message: "Order placed successfully",
      data: result,
    });
  },
);

export const getMyOrdersController = CatchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id as string;
    const result = await orderService.getMyOrders(userId);

    sendResponse(res, 200, {
      success: true,
      message: "Orders fetched successfully",
      data: result,
    });
  },
);

export const updateOrderStatusController = CatchAsync(
  async (req: Request, res: Response) => {
    const orderId = req.params.id as string;
    const result = await orderService.updateOrderStatus(orderId, req.body);

    sendResponse(res, 201, {
      success: true,
      message: "Order status updated",
      data: result,
    });
  },
);

export const cancelOrderController = CatchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id as string;
    const orderId = req.params.id as string;
    const result = await orderService.cancelOrder(userId, orderId);

    sendResponse(res, 201, {
      success: true,
      message: "Order cancelled successfully",
      data: result,
    });
  },
);
