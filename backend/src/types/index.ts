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
