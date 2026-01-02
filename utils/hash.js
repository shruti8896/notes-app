import bcrypt from "bcrypt";

export async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  return hashedPassword;
}

export async function comparePassword(enteredPassword, acutalPassword) {
  const isMatch = await bcrypt.compare(enteredPassword, acutalPassword);

  return isMatch;
}
