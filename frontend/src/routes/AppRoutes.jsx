import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Feed from "../pages/Feed";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/feed" replace />}
      />

      <Route
        path="/feed"
        element={<Feed />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      <Route
        path="*"
        element={<Navigate to="/feed" replace />}
      />
    </Routes>
  );
};

export default AppRoutes;