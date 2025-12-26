import express from "express";
import KnowledgeItem from "../models/knowledgeItem.js";
import mongoose from "mongoose";
import User from "../models/user.js";

export const knowledgeItemRouter = express.Router({ mergeParams: true });

//get all the notes for single user using aggregation pipeline

knowledgeItemRouter.get("/", async (req, res) => {
  const userId = req.params.id;
  const { type, tags, status, priority } = req.query;

  let matchQuery = { owner: new mongoose.Types.ObjectId(userId) };

  if (type) matchQuery.type = type;
  if (priority) matchQuery.priority = priority;
  if (status) matchQuery.status = status;

  if (tags) {
    const tagsArray = Array.isArray(tags) ? tags : tags.split(",");

    matchQuery.tags = { $in: tagsArray };
  }

  let pipeline = [
    { $match: matchQuery },
    { $unset: "__v" },
    {
      $group: {
        _id: "$owner",
        notes: { $push: "$$ROOT" },
        totalNotes: { $sum: 1 },
      },
    },
  ];

  const allNotesForUser = await KnowledgeItem.aggregate(pipeline);

  return res.json(allNotesForUser);
});

//get all notes of same type

//get all notes for a single user
// knowledgeItemRouter.get("/", async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log(id);

//     if (!id) {
//       return res.status(401).json({ message: "Unauthorized user" });
//     }

//     const allNotes = await KnowledgeItem.find({ owner: id });
//     res.status(200).json({ message: "Notes found", allNotes });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "unable to ftech users", error: error.message });
//   }
// });

//get single note from user using note id

knowledgeItemRouter.get("/:id", async (req, res) => {
  const noteId = req.params.id;

  if (!noteId) {
    return res.status(404).send("No notes found!!");
  }

  const note = await KnowledgeItem.findById(noteId);
  return res.status(200).json({ message: "Note found!!", note });
});

knowledgeItemRouter.post(["/", ""], async (req, res) => {
  try {
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);
    const { id } = req.params;
    const { title, content, type, tags, priority, status } = req.body;
    const user = await User.findById(id);
    console.log(user);
    const note = await KnowledgeItem.create({
      title,
      content,
      type,
      tags,
      priority,
      status,
      owner: id,
    });
    return res.status(201).json({ message: "Notes Created", note });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Unable to save note", error: error.message });
  }
});
