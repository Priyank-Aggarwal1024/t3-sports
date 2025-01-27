import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);

  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
};
export const AdminRoute = () => {
  const { currentUser } = useSelector((state) => state.user);

  return currentUser?.role == "admin" ? <Outlet /> : <Navigate to="/" />;
}