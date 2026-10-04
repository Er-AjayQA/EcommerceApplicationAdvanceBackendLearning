import express from "express";
import { verifyUser } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { addToCartSchema, updateCartItemSchema } from "./cart.schema.js";
import {
  addToCartController,
  clearCartController,
  getMyCartController,
  removeCartItemController,
  updateCartItemQuantityController,
} from "./cart.controller.js";
const router = express.Router();

router
  .route("/add-to-cart")
  .post(verifyUser, validate(addToCartSchema), addToCartController);

router.route("/my-cart").get(verifyUser, getMyCartController);

router
  .route("/update-quantity/:itemId")
  .patch(
    verifyUser,
    validate(updateCartItemSchema),
    updateCartItemQuantityController,
  );

router
  .route("/remove-item/:itemId")
  .delete(verifyUser, removeCartItemController);

router.route("/clear/:id").delete(verifyUser, clearCartController);

export default router;
