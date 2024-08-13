import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const HideRoute = () => {
  const { currentUser } = useSelector((state) => state.user);

  return !currentUser ? (
    <Outlet />
  ) : currentUser?.__v == 0 ? (
    <Navigate to="/" />
  ) : (
    <Navigate to="admin/dashboard" />
  );
};

export default HideRoute;
