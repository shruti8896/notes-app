import express from "express"
import { registerController } from "../controllers/auth.controller.js"
import { loginController } from "../controllers/auth.controller.js"
export const authRouter=express.Router()

authRouter.post("/register", registerController)
authRouter.post("/login", loginController)