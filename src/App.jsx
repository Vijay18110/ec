import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./Components/Login/Login";
import RegisterPage from "./Components/Registration/Register";
import HomePage from "./Pages/Home/Home";
import Private from "./Routes/Private/Private";
import useAuth from "./Hooks/useAuth";
import ProfilePage from "./Components/Profile/ProfilePage";
import './App.css'
export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Redirect root path based on auth */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/home" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Protected route */}
      <Route
        path="/home"
        element={
          <Private>
            <HomePage />
          </Private>
        }
      />
      <Route
        path="/profile"
        element={
          <Private>
            <ProfilePage />
          </Private>
        }
      />

      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Optional: catch-all */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />}
      />
    </Routes>
  );
}
