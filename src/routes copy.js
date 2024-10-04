import { lazy } from "react";
import { Navigate } from "react-router-dom";
import Loadable from "./components/Loadable";
import AuthGuard from "./contexts/auth/AuthGuard";
import { authRoles } from "./contexts/auth/authRoles";
import Layout1 from "./layouts/layout1";
import CEEDCivilForm from "./pages/ContractCreationTool";

const Login = Loadable(lazy(() => import("./pages/Login")));
const Dashboard = Loadable(lazy(() => import("./pages/ProjectTracker")));
const Archived = Loadable(lazy(() => import("./pages/Archived")));
const Finance = Loadable(lazy(() => import("./pages/FinanceTracker")));

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
        element: <Dashboard />,
        auth: authRoles.employee,
      },
      {
        path: "/archived",
        element: <Archived />,
        auth: authRoles.employee,
      },
      {
        path: "/finance",
        element: <Finance />,
        auth: authRoles.employee,
      },
      {
        path: "/contract-generator-tool",
        element: <CEEDCivilForm />,
        auth: authRoles.employee,
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/", element: <Navigate to="/login" /> },
];

export default routes;
