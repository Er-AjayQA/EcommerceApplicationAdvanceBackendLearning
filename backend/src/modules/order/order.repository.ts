import { OrderStatus } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { IOrderRepository } from "./order.interface.js";

export class OrderRepository implements IOrderRepository {
  async getOrderById(orderId: any) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } }, orderAddress: true },
    });
    return order;
  }

  async getOrdersByUserId(userId: string) {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } }, orderAddress: true },
    });
    return orders;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const order = await prisma.order.update({
      where: { id: orderId },
      include: { items: { include: { product: true } }, orderAddress: true },
      data: { status },
    });

    return order;
  }
}
