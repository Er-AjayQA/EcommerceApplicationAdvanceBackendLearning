import { OrderStatus, Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.js";
import { IAddressRepository } from "../address/address.interface.js";
import { IProductRepository } from "../product/product.interface.js";
import { IOrderRepository } from "./order.interface.js";
import { createOrderDTO, updateOrderStatusDTO } from "./order.schema.js";

export class OrderService {
  constructor(
    private orderRepo: IOrderRepository,
    private productRepo: IProductRepository,
    private addressRepo: IAddressRepository,
  ) {}

  async createOrder(userId: string, data: createOrderDTO) {
    const { items } = data;

    if (!items || items.length === 0) {
      throw new AppError("Order must contain atleast one product", 400);
    }

    return await prisma.$transaction(async (tx) => {
      const existingAddress = await this.addressRepo.findAddressById(
        data.addressId,
      );

      if (!existingAddress || existingAddress.userId !== userId) {
        throw new AppError("Invalid address", 404);
      }

      let totalPrice = new Prisma.Decimal(0);
      let totalItems = 0;
      const orderItemsData = [];

      for (const item of items) {
        const product = await this.productRepo.findProductById(item.productId);

        if (!product) {
          throw new AppError("Product not found", 404);
        }

        if (!product.isActive) {
          throw new AppError(`"${product.productName}" is not available`, 404);
        }

        if (product.stock <= item.quantity) {
          throw new AppError(
            `Insufficient stock for "${product.productName}"`,
            404,
          );
        }

        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: item.quantity } },
        });

        const itemTotal = product.price.mul(item.quantity);
        totalPrice = totalPrice.add(itemTotal);
        totalItems += item.quantity;

        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          priceAtPurchase: product.price,
        });
      }

      const order = await tx.order.create({
        data: {
          userId,
          totalItems,
          totalPrice,
          status: OrderStatus.PENDING,
          items: {
            create: orderItemsData,
          },
          orderAddress: {
            create: {
              addressLine1: existingAddress.addressLine1,
              addressLine2: existingAddress.addressLine2,
              city: existingAddress.city,
              state: existingAddress.state,
              pincode: existingAddress.pincode,
              country: existingAddress.country,
            },
          },
        },
        include: { items: { include: { product: true } }, orderAddress: true },
      });

      return order;
    });
  }

  async getOrderById(orderId: string) {
    const order = await this.orderRepo.getOrderById(orderId);
    return order;
  }

  async getMyOrders(userId: string) {
    const orders = await this.orderRepo.getOrdersByUserId(userId);
    return orders;
  }

  async updateOrderStatus(orderId: string, data: updateOrderStatusDTO) {
    const { status } = data;
    const existingOrder = await this.getOrderById(orderId);

    if (!existingOrder) {
      throw new AppError("Order not found", 404);
    }

    const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
      PENDING: [OrderStatus.PENDING, OrderStatus.CANCELLED],
      COMPLETED: [],
      CANCELLED: [],
    };

    if (!allowedTransitions[existingOrder.status].includes(status)) {
      throw new AppError(
        `Can't change status from ${existingOrder.status} to ${status}`,
        404,
      );
    }

    const updatedOrder = await this.orderRepo.updateOrderStatus(
      orderId,
      status,
    );

    return updatedOrder;
  }

  async cancelOrder(userId: string, orderId: string) {
    return await prisma.$transaction(async (tx) => {
      const existingOrder = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!existingOrder) {
        throw new AppError("Order not found", 404);
      }

      if (existingOrder.userId !== userId) {
        throw new AppError("Not authorized to perform this action", 401);
      }

      if (existingOrder.status !== "PENDING") {
        throw new AppError("Only pending orders can be cancelled", 400);
      }

      for (const item of existingOrder.items) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId, isActive: true },
        });

        if (!product) {
          throw new AppError("Product not found", 404);
        }

        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }

      const cancelledOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CANCELLED },
        include: { items: { include: { product: true } }, orderAddress: true },
      });

      return cancelledOrder;
    });
  }
}
