import { Navigate, Outlet } from "react-router-dom";
export function ProtectedRoute() { return localStorage.getItem("ironhouse_token") ? <Outlet /> : <Navigate to="/admin/login" replace />; }
