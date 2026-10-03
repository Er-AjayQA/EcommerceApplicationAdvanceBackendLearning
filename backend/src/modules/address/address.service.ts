import { AppError } from "../../utils/AppError.js";
import { IAddressRepository } from "./address.interface.js";
import { toAddressListResponse, toAddressResponse } from "./address.mapper.js";
import { cleanUpdateSchemaRequest } from "./address.request.js";
import { createAddressDTO, updateAddressDTO } from "./address.schema.js";

export class AddressService {
  constructor(private addressRepo: IAddressRepository) {}

  async createAddress(userId: string, data: createAddressDTO) {
    const ifAddressTypeExist =
      await this.addressRepo.findUserAddressByAddressType(
        userId,
        data.addressType,
      );

    if (ifAddressTypeExist) {
      throw new AppError("Address type already exist", 400);
    }

    const newAddress = await this.addressRepo.createAddress(userId, data);
    return toAddressResponse(newAddress);
  }

  async updateAddress(
    userId: string,
    addressId: string,
    data: updateAddressDTO,
  ) {
    const existingAddress = await this.addressRepo.findAddressById(addressId);

    if (!existingAddress) {
      throw new AppError("Address not found", 404);
    }

    if (existingAddress.userId !== userId) {
      throw new AppError("Your are not authorized for this action", 401);
    }

    let updateAddressData: updateAddressDTO = {};

    if (data.addressType !== undefined) {
      const isTypeExist = await this.addressRepo.findUserAddressByAddressType(
        userId,
        data.addressType,
      );

      if (isTypeExist && isTypeExist.id !== addressId) {
        throw new AppError("Address type already exist", 400);
      }

      updateAddressData.addressType = data.addressType;
    }

    updateAddressData = cleanUpdateSchemaRequest(data);

    const updatedAddress = await this.addressRepo.updateAddress(
      addressId,
      updateAddressData,
    );

    return toAddressResponse(updatedAddress);
  }

  async getMyAddresses(userId: string) {
    const addresses = await this.addressRepo.findUserAllAddresses(userId);
    return toAddressListResponse(addresses);
  }

  async deleteByIdAddress(userId: string, addressId: string) {
    const existingAddress = await this.addressRepo.findAddressById(addressId);

    if (!existingAddress) {
      throw new AppError("Address not found", 404);
    }

    if (existingAddress.userId !== userId) {
      throw new AppError("You are not authorized for this action", 401);
    }

    await this.addressRepo.deleteAddressById(addressId);
    return true;
  }
}
