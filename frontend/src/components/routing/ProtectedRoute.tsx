import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuthStore } from "../../store/auth";

export const ProtectedRoute = () => {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};
