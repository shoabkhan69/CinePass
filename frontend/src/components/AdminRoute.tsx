import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import EmptyState from "./EmptyState";
import LockRoundedIcon from "@mui/icons-material/LockRounded";

export default function AdminRoute() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!user?.isAdmin) {
    return (
      <EmptyState
        icon={<LockRoundedIcon fontSize="inherit" />}
        title="Admins only"
        description="You don't have access to this area."
      />
    );
  }

  return <Outlet />;
}
