import express from "express";
import User from "../models/user.js";
import mongoose from "mongoose";
import { hashPassword } from "../utils/hash.js";

export const userRouter = express.Router();

//get all users
userRouter.get("/", async (req, res) => {
  const allUsers = await User.find();

  res.send(allUsers);
  console.log("Fetch all the users from users database");
});
//get user with id
userRouter.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).populate("notes");
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "user not found!!" });
    }

    return res.status(200).send(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong!!", error: error.message });
  }
});

//create user

userRouter.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let nameExists = false;
    let emailExists = false;
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const existingUser = await User.find({
      $or: [{ name: name }, { email: email }],
    });

    existingUser.forEach((user) => {
      if (user.name === name) {
        console.log(user.name);
        console.log(name);
        nameExists = true;
      }
      if (user.email === email) {
        console.log(user.email);
        console.log(email);
        emailExists = true;
      }
    });
    if (nameExists && emailExists) {
      return res.status(500).send("User already exists!!!");
    }
    if (nameExists) {
      return res.status(500).send("Username already exists!!!");
    }
    if (emailExists) {
      return res.status(500).send("email id already exists!!!");
    }
    const hashedPwd = await hashPassword(password);
    console.log(hashedPwd);
    const user = await User.create({ name, email, password: hashedPwd });
    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create user", error: error.message });
  }
});

userRouter.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { name, email } = req.body;

  const user = await User.findById(id);
  console.log(user);
  if (!user) {
    console.log(user);
    return res.status(404).send("No user found!!");
  }
  const createUser = await User.findByIdAndUpdate(id, { name, email });

  console.log(createUser);
  return res.status(200).json({ message: "User updated", user });
});

userRouter.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (mongoose.Types.ObjectId.isValid(id)) {
      await User.findByIdAndDelete(id);

      return res.status(200).json({ message: "User Deleted" });
    }
  } catch (error) {
    console.log(error);
  }
});
