import { Role } from "../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
import { IAuthRepository } from "./auth.interface.js";

export class AuthRepository implements IAuthRepository {
  async createUser(data: {
    firstName: string;
    email: string;
    password: string;
    phoneNumber: string;
    lastName?: string | null;
    role?: Role;
  }) {
    const user = await prisma.user.create({ data });

    return user;
  }

  async getUserByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  }

  async getUserByuserId(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return user;
  }

  async createRefreshToken(data: {
    token: string;
    userId: string;
    expiresAt: Date;
  }) {
    const token = await prisma.refreshToken.create({ data });
    return token;
  }

  async findRefreshToken(hashedRefreshToken: string) {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { token: hashedRefreshToken },
    });

    return refreshToken;
  }

  async deleteRefreshTokenById(refreshTokenId: string) {
    await prisma.refreshToken.delete({ where: { id: refreshTokenId } });
    return true;
  }

  async deleteAllRefreshTokenByUser(userId: string) {
    await prisma.refreshToken.deleteMany({ where: { userId } });
    return true;
  }
}
