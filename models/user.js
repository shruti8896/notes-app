import mongoose from "mongoose";
import KnowledgeItem from "./knowledgeItem.js";

const refreshSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    password: { type: String, required: true, select: false },
    refreshTokens: [refreshSchema],
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
      },
      virtuals: true,
    },
    toObject: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
      },
      virtuals: true,
    },
  }
);

userSchema.pre("save", async function (next) {
  console.log("Saving user in the db");
});

userSchema.pre("findOneAndDelete", async function () {
  const userId = this.getQuery()._id;

  await KnowledgeItem.deleteMany({ owner: userId });
});

userSchema.post("save", function (doc) {
  console.log(`user saved!! ${doc._id}`);
});

userSchema.virtual("notes", {
  ref: "KnowledgeItem",
  localField: "_id",
  foreignField: "owner",
});
/**
 * @type {import("mongoose").Model<any>}
 */
export default mongoose.model("User", userSchema);
