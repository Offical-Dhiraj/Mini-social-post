export const getToken = () => {
  return localStorage.getItem("token");
};

export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const getUser = () => {
  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

export const setUser = (user) => {
  localStorage.setItem(
    "user",
    JSON.stringify(user)
  );
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};