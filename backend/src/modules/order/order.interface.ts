import { Order, OrderStatus } from "../../generated/prisma/client.js";

export interface IOrderRepository {
  getOrderById(orderId: any): Promise<Order | null>;
  getOrdersByUserId(userId: string): Promise<Order[] | null>;

  updateOrderStatus(
    orderId: string,
    status: OrderStatus,
  ): Promise<Order | null>;
}
