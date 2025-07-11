import { Navigate, useLocation, matchPath } from "react-router-dom";
import useAuth from "hooks/useAuth";
import routes from "../../routes"; // Import your routes
import { PERMISSIONS, AUTH_ROLES } from "./authRoles";

export default function AuthGuard({ children }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate replace to="/login" state={{ from: location.pathname }} />;
  }

  const matchingRoute = routes[0].children.find((route) => matchPath(route.path, location.pathname));

  if (matchingRoute && matchingRoute.requiredPermission) {
    if (!AUTH_ROLES[user?.role]?.includes(matchingRoute.requiredPermission)) {
      return <Navigate replace to="/404" />;
    }
  }

  return <>{children}</>;
}
