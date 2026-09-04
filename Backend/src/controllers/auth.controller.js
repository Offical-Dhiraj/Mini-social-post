const authService = require("../services/auth.service");
const {
  validateSignupInput,
  validateLoginInput,
} = require("../utils/validation");

const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const validationError = validateSignupInput({
      username,
      email,
      password,
    });

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const result = await authService.signup({
      username,
      email,
      password,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const validationError = validateLoginInput({
      email,
      password,
    });

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const result = await authService.login({
      email,
      password,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
};