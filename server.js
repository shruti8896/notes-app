import express from "express";
import "./config/db.js";

import { userRouter } from "./routes/users.route.js";
import { knowledgeItemRouter } from "./routes/knowledgeItem.route.js";
import knowledgeItem from "./models/knowledgeItem.js";

const app = express();
app.use(express.json());
app.use("/user", userRouter);

app.use("/user/:id/notes", knowledgeItemRouter);

app.listen(3000, () => {
  console.log("Server is listening:");
});


