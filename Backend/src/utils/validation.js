const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validateSignupInput = ({ username, email, password }) => {
  if (!username || !email || !password) {
    return "Username, email and password are required";
  }

  if (!isValidEmail(email)) {
    return "Please provide a valid email address";
  }

  if (password.length < 6) {
    return "Password must contain at least 6 characters";
  }

  return null;
};

const validateLoginInput = ({ email, password }) => {
  if (!email || !password) {
    return "Email and password are required";
  }

  if (!isValidEmail(email)) {
    return "Please provide a valid email address";
  }

  return null;
};

module.exports = {
  validateSignupInput,
  validateLoginInput,
};