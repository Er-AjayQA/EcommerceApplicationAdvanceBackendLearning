import express from "express";
import {
  createAddressController,
  deleteAddressByIdController,
  getMyAddressesController,
  updateAddressController,
} from "./address.controller.js";
import { verifyUser } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createAddressSchema, updateAddressSchema } from "./address.schema.js";
const router = express.Router();

router
  .route("/create-address")
  .post(verifyUser, validate(createAddressSchema), createAddressController);

router
  .route("/update-address/:id")
  .patch(verifyUser, validate(updateAddressSchema), updateAddressController);

router
  .route("/delete-address/:id")
  .delete(verifyUser, deleteAddressByIdController);

router.route("/my-addresses").get(verifyUser, getMyAddressesController);

export default router;
