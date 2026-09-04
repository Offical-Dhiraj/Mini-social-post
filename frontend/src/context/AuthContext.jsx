import {
  createContext,
  useMemo,
  useState,
} from "react";

import {
  loginUser,
  signupUser,
} from "../api/auth.api";

import {
  clearAuth,
  getUser,
  setToken,
  setUser,
} from "../utils/storage";

export const AuthContext =
  createContext(null);

export const AuthProvider = ({
  children,
}) => {
  const [user, setCurrentUser] =
    useState(getUser);

  const signup = async (data) => {
    return signupUser(data);
  };

  const login = async (credentials) => {
    const response =
      await loginUser(credentials);

    const {
      token,
      user: loggedInUser,
    } = response.data;

    setToken(token);
    setUser(loggedInUser);
    setCurrentUser(loggedInUser);

    return response;
  };

  const logout = () => {
    clearAuth();
    setCurrentUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      signup,
      login,
      logout,
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};