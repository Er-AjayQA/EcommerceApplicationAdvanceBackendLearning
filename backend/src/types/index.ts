import { Prisma } from "../generated/prisma/client.js";
import { Role } from "../generated/prisma/enums.js";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

export interface IJwtPayload {
  id: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export type CartWithItems = Prisma.CartGetPayload<{
  include: {
    items: {
      include: {
        product: true;
      };
    };
  };
}>;

export type CartItemWithProduct = Prisma.CartItemsGetPayload<{
  include: {
    product: true;
  };
}>;

export type ProductQueryOptions = {
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: "latest" | "oldest" | "priceAsc" | "priceDesc";

  limit?: number;
  cursor?: string;
};
