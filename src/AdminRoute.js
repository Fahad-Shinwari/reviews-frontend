import React from "react";
import { Navigate, Route,Outlet } from "react-router-dom";

const AdminRoute =() => {
  const role = JSON.parse(localStorage.getItem("role"));
  return role == 'admin' ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoute;