import express from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  loginUserSchema,
  logoutUserSchema,
  refreshTokenSchema,
  registerUseSchema,
} from "./auth.schema.js";
import {
  getLoggedInUserController,
  loginController,
  logoutController,
  logoutAllDevicesController,
  registerUserController,
  refreshTokenController,
} from "./auth.controller.js";
import { verifyUser } from "../../middlewares/auth.middleware.js";
const router = express.Router();

router
  .route("/register")
  .post(validate(registerUseSchema), registerUserController);

router.route("/login").post(validate(loginUserSchema), loginController);
router.route("/me").get(verifyUser, getLoggedInUserController);
router.route("/logout").post(verifyUser, logoutController);
router
  .route("/logout-all-devices")
  .post(verifyUser, validate(logoutUserSchema), logoutAllDevicesController);
router
  .route("/refresh-token")
  .post(verifyUser, validate(refreshTokenSchema), refreshTokenController);

export default router;
