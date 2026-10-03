import { Request, Response } from "express";
import { CatchAsync } from "../../utils/CatchAsync.js";
import { addressService } from "./address.container.js";
import { sendResponse } from "../../utils/sendResponse.js";

export const createAddressController = CatchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id as string;
    const result = await addressService.createAddress(userId, req.body);

    sendResponse(res, 201, {
      success: true,
      message: "Address created successfully",
      data: result,
    });
  },
);

export const updateAddressController = CatchAsync(
  async (req: Request, res: Response) => {
    const addressId = req.params.id as string;
    const userId = req.user.id as string;
    const result = await addressService.updateAddress(
      userId,
      addressId,
      req.body,
    );

    sendResponse(res, 201, {
      success: true,
      message: "Address updated successfully",
      data: result,
    });
  },
);

export const getMyAddressesController = CatchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.is as string;
    const result = await addressService.getMyAddresses(userId);

    sendResponse(res, 200, {
      success: true,
      message: "Fetched all addresses",
      data: result,
    });
  },
);

export const deleteAddressByIdController = CatchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id as string;
    const addressId = req.params.id as string;
    const result = await addressService.deleteByIdAddress(userId, addressId);

    sendResponse(res, 200, {
      success: true,
      message: "Address deleted successfully",
    });
  },
);
