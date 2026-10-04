import express from "express";
import {
  verifyAdmin,
  verifySeller,
  verifyUser,
} from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createProductSchema, updateProductSchema } from "./product.schema.js";
import {
  createProductController,
  deleteProductController,
  getAllActiveProductsController,
  getAllProductsController,
  getProductsByCategoryController,
  toggleProductStatusController,
  updateProductController,
} from "./product.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";
const router = express.Router();

router
  .route("/create")
  .post(
    verifyUser,
    verifySeller,
    upload.array("images"),
    validate(createProductSchema),
    createProductController,
  );

router
  .route("/update/:id")
  .patch(
    verifyUser,
    verifySeller,
    upload.array("images"),
    validate(updateProductSchema),
    updateProductController,
  );

router
  .route("/delete/:id")
  .delete(verifyUser, verifySeller, deleteProductController);

router
  .route("/toggle-status/:id")
  .patch(verifyUser, verifySeller, toggleProductStatusController);

router.route("/all").get(verifyUser, verifySeller, getAllProductsController);
router.route("/category/:catId").get(getProductsByCategoryController);
router.route("/active").get(getAllActiveProductsController);

export default router;
