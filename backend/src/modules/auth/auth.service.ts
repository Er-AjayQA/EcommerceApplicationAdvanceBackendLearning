import { AppError } from "../../utils/AppError.js";
import {
  comparePassword,
  hashPassword,
  hashRefreshToken,
} from "../../utils/auth.helper.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/jwt.helper.js";
import { IAuthRepository } from "./auth.interface.js";
import { toAuthResponse, toJwtPayload } from "./auth.mapper.js";
import { loginUserDTO, registerUserDTO } from "./auth.schema.js";

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
}
