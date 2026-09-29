import { RefreshToken, Role, User } from "../../generated/prisma/client.js";

export interface IAuthRepository {
  createUser(data: {
    firstName: string;
    email: string;
    password: string;
    phoneNumber: string;
    lastName?: string | null;
    role?: Role;
  }): Promise<User>;

  getUserByEmail(email: string): Promise<User | null>;
  getUserByuserId(userId: string): Promise<User | null>;

  createRefreshToken(data: {
    token: string;
    userId: string;
    expiresAt: Date;
  }): Promise<RefreshToken>;
}
