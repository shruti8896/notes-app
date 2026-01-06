import jwt from "jsonwebtoken";

export function generateAccessToken(user) {
  const accessToken = jwt.sign(
    { userId: user._id, type: "access" }, //add type of the token
    process.env.JWT_Access_SECRET_KEY,
    {
      expiresIn: process.env.JWT_Access_Token_Expiry,
    }
  );

  return accessToken;
}

export function generateRefreshToken(user) {
  const refreshToken = jwt.sign(
    { userId: user._id, type: "refresh" },
    //add the type of the token

    process.env.JWT_Refresh_SECRET_KEY,
    {
      expiresIn: process.env.JWT_Refresh_Token_Expiry,
    }
  );

  return refreshToken;
}

export function verifyAccessToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_Access_SECRET_KEY);

    return decoded;
  } catch (error) {
    throw error;
  }
}

export function verifyRefreshToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_Refresh_SECRET_KEY);
    console.log("decoded data from verify function");
    console.log(decoded);

    if (decoded.type === "refresh") {
      return decoded;
    } else throw new Error("Invalid refresh token");
  } catch (error) {
    console.log(error);
    throw error;
  }
}
