import { NextFunction, Request, Response } from "express";
import { CatchAsync } from "../../utils/CatchAsync.js";
import { authService } from "./auth.container.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { destroyCookies, setCookies } from "../../utils/auth.helper.js";

export const registerUserController = CatchAsync(
  async (req: Request, res: Response) => {
    const result = await authService.registerUser(req.body);

    setCookies(res, result.accessToken, result.refreshToken);

    sendResponse(res, 201, {
      success: true,
      message: "Account created successfully",
      data: result,
    });
  },
);

export const loginController = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.loginUser(req.body);

    setCookies(res, result.accessToken, result.refreshToken);

    sendResponse(res, 201, {
      success: true,
      message: "LoggedIn successfully",
      data: result,
    });
  },
);

export const getLoggedInUserController = CatchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const result = await authService.getCurrentUser(user.id as string);

    sendResponse(res, 200, {
      success: true,
      message: "Fetched user successfully",
      data: result,
    });
  },
);

export const logoutController = CatchAsync(
  async (req: Request, res: Response) => {
    const isLoggedOut = await authService.logout(req.body);

    if (isLoggedOut) {
      destroyCookies(res);
    }

    sendResponse(res, 200, {
      success: true,
      message: "LoggedOut Successfully",
    });
  },
);

export const logoutAllDevicesController = CatchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id as string;
    const isLoggedOut = await authService.logoutAllDevices(userId);

    if (isLoggedOut) {
      destroyCookies(res);
    }

    sendResponse(res, 201, {
      success: true,
      message: "Logout from all devices",
    });
  },
);

export const refreshTokenController = CatchAsync(
  async (req: Request, res: Response) => {
    const result = await authService.refreshToken(req.body);

    setCookies(res, result.accessToken, result.refreshToken);

    sendResponse(res, 201, {
      success: true,
      message: "Refresh token created successfully",
      data: result,
    });
  },
);
