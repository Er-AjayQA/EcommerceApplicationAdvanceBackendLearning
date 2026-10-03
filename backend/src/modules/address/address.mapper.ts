import { Address } from "../../generated/prisma/client.js";
import { addressResponseDTO } from "./address.response.js";

export const toAddressResponse = (address: Address): addressResponseDTO => {
  return {
    id: address.id,
    userId: address.userId,
    addressType: address.addressType,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2,
    city: address.city,
    state: address.state,
    pincode: address.pincode,
    country: address.country,
    createdAt: address.createdAt,
    updatedAt: address.updatedAt,
  };
};

export const toAddressListResponse = (
  addresses: Address[],
): addressResponseDTO[] => {
  return addresses.map(toAddressResponse);
};
