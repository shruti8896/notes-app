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

    const hashedToken = await hashPassword(refreshToken);

    const status = await User.findByIdAndUpdate(
      user.id,
      {
        $push: {
          refreshTokens: {
            token: hashedToken,
            isActive: true,
          },
        },
      },
      {
        new: true,
      }
    );

    console.log(status);
    user.password = undefined;

    return { accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
}

export async function refreshAccessToken(refresh) {
  try {
    const decodedData = verifyRefreshToken(refresh);
    console.log("decoded data");
    console.log(decodedData.userId);
    const user = await User.findById(decodedData.userId).select(
      "refreshTokens"
    );
    if (!user) {
      throw new Error("User not found");
    }

    console.log(
      "-----------------------fetching all the refresh tokens stored in db"
    );
    console.log(user);
    console.log("-------------------------------------------------------");
    let activeToken = null;
    for (const token of user.refreshTokens) {
      if (!token.isActive) continue;
      const tokenMatch = await comparePassword(refresh, token.token);
      if (tokenMatch) {
        activeToken = token;
        break;
      }
    }

    console.log("------------------active tokens");
    console.log(activeToken);
    if (!activeToken) {
      throw new Error("Invalid or reused refresh token");
    }
    const hashedOldToken = activeToken.token;

    if (activeToken.isActive) {
      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);
      //TODO: set is active false for the current token
      const hashedNewToken = await hashPassword(newRefreshToken);
      console.log(hashedNewToken);
      console.log("updating the isActive status as false");
      const result = await User.updateOne(
        {
          _id: user._id,
          "refreshTokens.token": hashedOldToken,
          "refreshTokens.isActive": true,
        },
        {
          $set: {
            "refreshTokens.$.isActive": false,
          },
        }
      );

      await User.updateOne(
        { _id: user._id },
        {
          $push: {
            refreshTokens: {
              token: hashedNewToken,
              isActive: true,
            },
          },
        }
      );
      return { newAccessToken, newRefreshToken };
    } else throw new Error("Session Expired!!");
  } catch (error) {
    throw error;
  }
}
