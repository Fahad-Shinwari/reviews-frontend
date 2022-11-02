import React from "react";
import { Navigate, Route,Outlet } from "react-router-dom";

const ManagerRoute =() => {
  const role = JSON.parse(localStorage.getItem("role"));
  return role == 'manager' ? <Outlet /> : <Navigate to="/" replace />;
};

export default ManagerRoute;