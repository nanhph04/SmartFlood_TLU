import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const login = async (email, password) => {
  const user = await User.findOne({ email }).lean();

  if (!user) {
    throw Object.assign(new Error("Invalid email or password"), {
      status: 401,
    });
  }

  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) {
    throw Object.assign(new Error("Invalid email or password"), {
      status: 401,
    });
  }

  const token = jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || "7d" }
  );

  // log để đối chiếu nếu cần
  console.log("LOGIN issue token for", user.email, "role:", user.role);

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
  };
};
