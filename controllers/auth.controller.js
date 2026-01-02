import { registerUser } from "../services/auth.service.js";
import { loginUser } from "../services/auth.service.js";

export async function registerController(req, res) {
  try {
    const { name, email, password, role } = req.body;
    const response = await registerUser({ name, email, password, role });
    res.status(201).json({
      message: "User created successfully",
      response,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create user", error: error.message });
  }
}

export async function loginController(req, res) {
  try {
    const { email, password } = req.body;
    const loginResponse = await loginUser({ email, password });
    res.status(201).json({ message: "Login Successfull", loginResponse });
  } catch (error) {
    res.status(500).json({ message: "Failed to login ", error: error.message });
  }
}
