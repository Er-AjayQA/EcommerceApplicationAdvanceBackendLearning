import { Address } from "../../generated/prisma/client.js";
import { createAddressDTO, updateAddressDTO } from "./address.schema.js";

export interface IAddressRepository {
  createAddress(userId: string, data: createAddressDTO): Promise<Address>;
  updateAddress(addressId: string, data: updateAddressDTO): Promise<Address>;
  deleteAddressById(addressId: string): Promise<boolean>;

  findAddressById(id: string): Promise<Address | null>;
  findUserAddressByAddressType(
    userId: string,
    type: string,
  ): Promise<Address | null>;
  findUserAllAddresses(userId: string): Promise<Address[] | []>;
}
