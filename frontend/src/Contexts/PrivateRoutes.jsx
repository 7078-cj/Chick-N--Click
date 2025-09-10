import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import AuthContext from "../Contexts/AuthContext";

function PrivateRoutes({ allowedRoles }) {
  const { user, fetchingUser } = useContext(AuthContext);
  const location = useLocation();

  if (fetchingUser) {
 
    return <Navigate to="/loading" state={{ from: location }} replace />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return allowedRoles.includes(user.role) ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" replace />
  );
}

export default PrivateRoutes;
