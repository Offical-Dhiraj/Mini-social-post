const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateToken } = require("../utils/jwt");

const signup = async ({ username, email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    const error = new Error("Email is already registered");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    username: username.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  };
};

const login = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+password");

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordMatches) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken({
    userId: user._id.toString(),
    username: user.username,
  });

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  };
};

module.exports = {
  signup,
  login,
};