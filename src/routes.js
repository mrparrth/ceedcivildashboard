import { Navigate } from "react-router-dom";
import AuthGuard from "./contexts/auth/AuthGuard";
import { authRoles } from "./contexts/auth/authRoles";
import Layout1 from "./Layouts/Layout1";
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
        auth: authRoles.employee
      },
      {
        path: "/archived",
        element: <Archived />,
        auth: authRoles.employee
      },
      {
        path: "/finance",
        element: <FinanceTracker />,
        auth: authRoles.employee
      },
      {
        path: "/contract-generator-tool",
        element: <CEEDCivilForm />,
        auth: authRoles.employee
      }
    ]
  },
  { path: "/login", element: <Login /> },
  { path: "/", element: <Navigate to="/login" /> },
  { path: "*", element: <Navigate to="/login" /> }
];

export default routes;
