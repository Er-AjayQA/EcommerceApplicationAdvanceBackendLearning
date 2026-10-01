import { IJwtPayload } from "../../types/index.js";
import { AppError } from "../../utils/AppError.js";
import {
  comparePassword,
  hashPassword,
  hashRefreshToken,
} from "../../utils/auth.helper.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.helper.js";
import { IAuthRepository } from "./auth.interface.js";
import { toAuthResponse, toJwtPayload } from "./auth.mapper.js";
import {
  loginUserDTO,
  logoutUserDTO,
  refreshTokenDTO,
  registerUserDTO,
} from "./auth.schema.js";

export class AuthService {
  constructor(private userRepo: IAuthRepository) {}

  async registerUser(data: registerUserDTO) {
    const { firstName, lastName, email, password, role, phoneNumber } = data;

    const existingUser = await this.userRepo.getUserByEmail(email);

    if (existingUser) {
      throw new AppError("User with this email already registered", 400);
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await this.userRepo.createUser({
      ...data,
      password: hashedPassword,
      lastName: lastName ?? null,
      role: role ?? "USER",
    });

    const jwtPayload = toJwtPayload(newUser);

    const accessToken = generateAccessToken(jwtPayload);
    const refreshToken = generateRefreshToken(jwtPayload);

    const hashedRefreshToken = hashRefreshToken(refreshToken);

    await this.userRepo.createRefreshToken({
      token: hashedRefreshToken as string,
      userId: newUser.id as string,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return {
      user: toAuthResponse(newUser),
      accessToken,
      refreshToken,
    };
  }

  async loginUser(data: loginUserDTO) {
    const { email, password } = data;
    const existingUser = await this.userRepo.getUserByEmail(email);

    if (!existingUser) {
      throw new AppError("Invalid credentials", 401);
    }

    const checkPassword = await comparePassword(
      password,
      existingUser.password,
    );

    if (!checkPassword) {
      throw new AppError("Invalid credentials", 401);
    }

    const jwtPayload = {
      id: existingUser.id,
      email: existingUser.email,
      role: existingUser.role,
      createdAt: existingUser.createdAt,
      updatedAt: existingUser.updatedAt,
    };

    const accessToken = generateAccessToken(jwtPayload);
    const refreshToken = generateRefreshToken(jwtPayload);
    const hashedRefreshToken = hashRefreshToken(refreshToken);

    await this.userRepo.createRefreshToken({
      token: hashedRefreshToken as string,
      userId: existingUser.id as string,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return {
      user: toAuthResponse(existingUser),
      accessToken,
      refreshToken,
    };
  }

  async getCurrentUser(userId: string) {
    const user = await this.userRepo.getUserByuserId(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }
    return toAuthResponse(user);
  }

  async logout(data: logoutUserDTO) {
    const { refreshToken } = data;
    if (!refreshToken) {
      throw new AppError("Refresh token is required", 400);
    }

    const hasgedRefreshToken = hashRefreshToken(refreshToken);
    const existingToken =
      await this.userRepo.findRefreshToken(hasgedRefreshToken);

    if (!existingToken) {
      throw new AppError("Invalid refresh token", 404);
    }

    await this.userRepo.deleteRefreshTokenById(existingToken.id);
    return true;
  }

  async logoutAllDevices(userId: string) {
    if (!userId) {
      throw new AppError("User Id is required", 400);
    }

    await this.userRepo.deleteAllRefreshTokenByUser(userId);
    return true;
  }

  async refreshToken(data: refreshTokenDTO) {
    const { refreshToken } = data;

    if (!refreshToken) {
      throw new AppError("Refresh token is required", 400);
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken) as IJwtPayload;
    } catch (error) {
      throw new AppError("Invalid or expired refresh token", 403);
    }

    const hashedOldToken = hashRefreshToken(refreshToken);

    const existingToken = await this.userRepo.findRefreshToken(
      hashedOldToken as string,
    );

    if (!existingToken) {
      throw new AppError("Refresh token not found", 404);
    }

    await this.userRepo.deleteRefreshTokenById(existingToken.id);

    const jwtPayload = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      createdAt: decoded.createdAt,
      updatedAt: decoded.updatedAt,
    };

    const newAccessToken = generateAccessToken(jwtPayload);
    const newRefreshToken = generateRefreshToken(jwtPayload);
    const hashedNewRefreshToken = hashRefreshToken(newRefreshToken);

    const user = await this.userRepo.getUserByuserId(decoded.id as string);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    await this.userRepo.createRefreshToken({
      token: hashedNewRefreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
