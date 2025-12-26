import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  {
    timestamps: true,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtuals("notes",{
  ref:"KnowledgeItem",
  localField:"_id",
  foreignField:""
})
/**
 * @type {import("mongoose").Model<any>}
 */
export default mongoose.model("User", userSchema);
