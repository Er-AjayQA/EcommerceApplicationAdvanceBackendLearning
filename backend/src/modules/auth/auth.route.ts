import express from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { registerUseSchema } from "./auth.schema.js";
import { registerUserController } from "./auth.controller.js";
const router = express.Router();

router
  .route("/register")
  .post(validate(registerUseSchema), registerUserController);

export default router;
