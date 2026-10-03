import { AddressRepository } from "../address/address.repository.js";
import { ProductRepository } from "../product/product.repository.js";
import { OrderRepository } from "./order.repository.js";
import { OrderService } from "./order.service.js";

const orderRepository = new OrderRepository();
const productRepository = new ProductRepository();
const addressRepository = new AddressRepository();
const orderService = new OrderService(
  orderRepository,
  productRepository,
  addressRepository,
);

export { orderService };
