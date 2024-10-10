import { Navigate, useLocation, matchPath } from "react-router-dom";
import { useAuth } from "./AuthContext";
import routes from "../../routes"; // Import your routes

export default function AuthGuard({ children }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate replace to="/login" state={{ from: location.pathname }} />;
  }

  const matchingRoute = routes[0].children.find((route) =>
    matchPath(route.path, location.pathname)
  );

  if (matchingRoute && matchingRoute.auth) {
    const requiredRole = matchingRoute.auth;
    if (!requiredRole.includes(user?.role?.toUpperCase())) {
      return <Navigate replace to="/404" />;
    }
  }

  return <>{children}</>;
}
