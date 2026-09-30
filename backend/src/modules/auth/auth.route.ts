import express from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { loginUserSchema, registerUseSchema } from "./auth.schema.js";
import { loginController, registerUserController } from "./auth.controller.js";
const router = express.Router();

router
  .route("/register")
  .post(validate(registerUseSchema), registerUserController);

router.route("/login").post(validate(loginUserSchema), loginController);

export default router;
