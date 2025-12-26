import mongoose from "mongoose";
import { User } from "./user";

const profileSchema = mongoose.Schema({
  bio: String,
  experience: { type: String, enum: ["beginner", "intermediate", "advanced"] },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export const Profile = mongoose.model("Profile", profileSchema);
