import { comparePassword, hashPassword } from "../utils/hash.js";
import { userRouter } from "../routes/users.route.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";

export async function registerUser(data) {
  try {
    const { name, email, password, role } = data;
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
      throw new Error("User already exists");
    }
    if (nameExists) {
      throw new Error("Username already exists");
    }
    if (emailExists) {
      throw new Error("User email already exists");
    }
    const hashedPwd = await hashPassword(password);
    console.log(hashedPwd);
    const user = await User.create({ name, email, password: hashedPwd });
    return user;
  } catch (error) {
    throw new Error(error);
  }
}

export async function loginUser(data) {
  try {
    const { email, password } = data;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new Error("User not found!!");
    }
    const isMatch = comparePassword(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid Password");
    }
    console.log(user);
    user.password = undefined;
    return user;
  } catch (error) {
    throw error;
  }
}
