import { Navigate } from "react-router-dom";
import AuthGuard from "./contexts/auth/AuthGuard";
import { PERMISSIONS } from "./contexts/auth/authRoles";
import Layout1 from "./layouts/Layout1";
import CEEDCivilForm from "./pages/ContractCreationTool";
import Login from "./pages/Login";
import ProjectTracker from "./pages/ProjectTracker";
import Archived from "./pages/Archived";
import FinanceTracker from "./pages/FinanceTracker";
// import NotFound from "./pages/NotFound";

const routes = [
  {
    element: (
      <AuthGuard>
        <Layout1 />
      </AuthGuard>
    ),
    children: [
      {
        path: "/dashboard",
        element: <ProjectTracker />,
        permission: PERMISSIONS.projects,
      },
      {
        path: "/archived",
        element: <Archived />,
        permission: PERMISSIONS.projects,
      },
      {
        path: "/finance",
        element: <FinanceTracker />,
        permission: PERMISSIONS.finance,
      },
      {
        path: "/contract-generator-tool",
        element: <CEEDCivilForm />,
        permission: PERMISSIONS.forms,
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/", element: <Navigate to="/login" /> },
  { path: "*", element: <Navigate to="/login" /> },
];

export default routes;
