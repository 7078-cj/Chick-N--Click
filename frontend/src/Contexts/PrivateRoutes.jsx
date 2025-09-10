import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../Contexts/AuthContext";

function PrivateRoutes({ allowedRoles }) {
    
    const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return allowedRoles.includes(user.role) ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" replace /> // or show a 403 page
  );
  
}

export default PrivateRoutes