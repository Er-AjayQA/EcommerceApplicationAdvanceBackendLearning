import express from "express";
import { verifyAdmin, verifyUser } from "../../middlewares/auth.middleware.js";
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
} from "./category.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "./category.schema.js";
const router = express.Router();

router
  .route("/create")
  .post(
    verifyUser,
    verifyAdmin,
    validate(createCategorySchema),
    createCategoryController,
  );

router
  .route("/update/:id")
  .patch(
    verifyUser,
    verifyAdmin,
    validate(updateCategorySchema),
    updateCategoryController,
  );

router.route("/all").get(getAllCategoriesController);
router.route("/:id").get(getCategoryByIdController);
router.route("/:id").delete(verifyUser, verifyAdmin, deleteCategoryController);

export default router;
