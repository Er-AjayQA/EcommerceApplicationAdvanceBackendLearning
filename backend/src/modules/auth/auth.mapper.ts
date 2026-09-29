import { User } from "../../generated/prisma/client.js";
import { authResponseDTO } from "./auth.response.js";

export const toAuthResponse = (user: User): authResponseDTO => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phoneNumber: user.phoneNumber,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});
