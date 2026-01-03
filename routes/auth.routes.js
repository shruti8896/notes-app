import express from "express";
import {
  accessTokenRefreshController,
  registerController,
} from "../controllers/auth.controller.js";
import { loginController } from "../controllers/auth.controller.js";
export const authRouter = express.Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.post("/refresh-token", accessTokenRefreshController);
