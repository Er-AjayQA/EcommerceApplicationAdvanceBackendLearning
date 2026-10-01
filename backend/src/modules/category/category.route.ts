import express from "express";
import { verifyAdmin, verifyUser } from "../../middlewares/auth.middleware.js";
import {
  createCategoryController,
  deleteCategoryController,
  getCategoryByIdController,
} from "./category.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createCategorySchema } from "./category.schema.js";
const router = express.Router();

router
  .route("/create")
  .post(
    verifyUser,
    verifyAdmin,
    validate(createCategorySchema),
    createCategoryController,
  );
router.route("/:id").get(verifyUser, getCategoryByIdController);
router.route("/:id").delete(verifyUser, verifyAdmin, deleteCategoryController);

export default router;
