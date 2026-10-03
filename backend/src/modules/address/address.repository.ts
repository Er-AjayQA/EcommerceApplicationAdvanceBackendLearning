import { prisma } from "../../lib/prisma.js";
import { IAddressRepository } from "./address.interface.js";
import { createAddressDTO, updateAddressDTO } from "./address.schema.js";

export class AddressRepository implements IAddressRepository {
  async createAddress(userId: string, data: createAddressDTO) {
    const address = await prisma.address.create({
      data: {
        userId,
        ...data,
      },
    });

    return address;
  }

  async updateAddress(addressId: string, data: updateAddressDTO) {
    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data,
    });

    return updatedAddress;
  }

  async deleteAddressById(addressId: string) {
    await prisma.address.delete({ where: { id: addressId } });
    return true;
  }

  async findAddressById(id: string) {
    const address = await prisma.address.findUnique({ where: { id } });
    return address;
  }

  async findUserAddressByAddressType(userId: string, type: string) {
    const address = await prisma.address.findFirst({
      where: { userId, addressType: type },
    });
    return address;
  }

  async findUserAllAddresses(userId: string) {
    const addresses = await prisma.address.findMany({ where: { userId } });
    return addresses;
  }
}
