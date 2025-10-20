import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./Routes/Home.jsx";
import Login from "./Routes/Login.jsx";
import ProtectedRoute from "./Routes/ProtectedRoute.jsx"; 
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./Routes/Register.jsx";
import Profile from "./Routes/Profile.jsx";
import Details from "./Routes/Details.jsx";
import User from "./Routes/User.jsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
    {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path : "/me",
    element : (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
    {
    path : "/details",
    element : (
      <ProtectedRoute>
        <Details />
      </ProtectedRoute>
    ),
  },
      {
    path : "/User/:username",
    element : (
        <User />
    ),
  }
]);

// render
createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
);
