import { comparePassword, hashPassword } from "../utils/hash.js";
import User from "../models/user.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  verifyAccessToken,
} from "../utils/token.js";

export async function registerUser(data) {
  try {
    const { name, email, password, role } = data;
    let nameExists = false;
    let emailExists = false;
    if (!name || !email || !password) {
      throw new Error("Name and email are required");
    }

    const existingUser = await User.find({
      $or: [{ name }, { email }],
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
    throw error;
  }
}

export async function loginUser(data) {
  try {
    const { email, password } = data;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new Error("User not found!!");
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid Password");
    }
    console.log(user);
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.password = undefined;

    return { accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
}

export function refreshAccessToken(refresh) {
  try {
    const decodedData = verifyRefreshToken(refresh);
    const newAccessToken = generateAccessToken(decodedData);
    const newRefreshToken = generateRefreshToken(decodedData);
    return { newAccessToken, newRefreshToken };
  } catch (error) {
    throw error;
  }
}
