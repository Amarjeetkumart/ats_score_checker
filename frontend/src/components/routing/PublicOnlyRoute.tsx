import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "../../store/auth";

export const PublicOnlyRoute = () => {
  const user = useAuthStore((state) => state.user);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
