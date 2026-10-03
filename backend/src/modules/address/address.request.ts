import { updateAddressDTO } from "./address.schema.js";

export const cleanUpdateSchemaRequest = (address: updateAddressDTO) => {
  return {
    addressType: address?.addressType,
    addressLine1: address?.addressLine1,
    addressLine2: address?.addressLine2,
    city: address?.city,
    state: address?.state,
    pincode: address?.pincode,
    country: address?.country,
  };
};
