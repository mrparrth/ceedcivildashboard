import "./App.css"; // Ensure custom styles are correctly applied

// import Home from './components/pages/Home';
import Register from "./pages/pages/Register";
import Login from "./pages/pages/Login";
import Dashboard from "./pages/pages/Dashboard";
import UserData from "./pages/UserData";
import ProjectTracker from "./pages/pages/ProjectTracker";
import ProjectDetails from "./pages/pages/ProjectDetails";
import ArchiveProject from "./pages/pages/Archieve"; // Corrected name
import Finance from "./pages/pages/Finance";
import NewProject from "./pages/pages/Newproject"; // Corrected name
import EditableField from "./pages/pages/EditableField";

import Drafter from "./pages/MoreData/Drafter"; // Corrected name
import Engineering from "./pages/MoreData/Engineering"; // Corrected name
import Mep from "./pages/MoreData/Mep"; // Corrected name
import Civil from "./pages/MoreData/Civil"; // Corrected name

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/adminregister" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="login" element={<Login />} />
          <Route path="user" element={<UserData />} />
          <Route path="project-tracker" element={<ProjectTracker />} />
          <Route path="project-details/:id" element={<ProjectDetails />} />
          <Route path="archive" element={<ArchiveProject />} />{" "}
          {/* Corrected 'archieve' to 'archive' */}
          <Route path="finance" element={<Finance />} />
          <Route path="newproject" element={<NewProject />} />
          <Route path="editable" element={<EditableField />} />
          <Route path="project-details/:id/drafter" element={<Drafter />} />
          <Route
            path="project-details/:id/engineering"
            element={<Engineering />}
          />
          <Route path="project-details/:id/mep" element={<Mep />} />
          <Route path="project-details/:id/civil" element={<Civil />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
