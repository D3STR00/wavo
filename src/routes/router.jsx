import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import AppPage from "../pages/App";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    )
  },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <AppPage />
      </ProtectedRoute>
    )
  }
]);