import mongoose from "mongoose";

const knowledgeItemSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    content: String,
    type: {
      type: String,
      enum: ["note", "article", "video", "task"],
      required: true,
      default: "article",
    },
    tags: [String],
    priority: { type: String, enum: ["high", "low", "medium"], default: "low" },
    status: { type: String, enum: ["active", "archived"] },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },

  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
      virtuals: true,
    },
    toObject: {
      transform(doc, ret) {
        delete ret.__v;
      },
      virtuals: true,
    },
  }
);

/**
 * @type {import("mongoose").Model<any>}
 */

export default mongoose.model("KnowledgeItem", knowledgeItemSchema);
