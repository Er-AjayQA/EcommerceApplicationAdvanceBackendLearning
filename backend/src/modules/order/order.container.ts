import { ProductRepository } from "../product/product.repository.js";
import { OrderRepository } from "./order.repository.js";
import { OrderService } from "./order.service.js";

const orderRepository = new OrderRepository();
const productRepository = new ProductRepository();
const orderService = new OrderService(orderRepository, productRepository);

export { orderService };
