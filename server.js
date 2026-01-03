import express from "express";
import dotenv from "dotenv";
import "./config/db.js";

import { userRouter } from "./routes/users.route.js";
import { knowledgeItemRouter } from "./routes/knowledgeItem.route.js";
import knowledgeItem from "./models/knowledgeItem.js";
import { authRouter } from "./routes/auth.routes.js";
import { verify } from "./middlewares/verifyToken.js";

const app = express();
app.use(express.json());
dotenv.config();

app.use("/auth", authRouter);
app.use(verify);
app.use("/user", userRouter);

app.use("/user/:id/notes", knowledgeItemRouter);

app.listen(3000, () => {
  console.log("Server is listening:");
});
