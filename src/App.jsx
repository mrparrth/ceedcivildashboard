import './App.css'; // Ensure custom styles are correctly applied

// import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserData from './components/UserData';
import ProjectTracker from './components/ProjectTracker';
import ProjectDetails from './components/ProjectDetails';
import ArchiveProject from './components/Archieve'; // Corrected name
import Finance from './components/Finance';
import NewProject from './components/Newproject'; // Corrected name
import EditableField from './components/EditableField';

import Drafter from './components/MoreData/Drafter'; // Corrected name
import Engineering from './components/MoreData/Engineering'; // Corrected name
import Mep from './components/MoreData/Mep'; // Corrected name
import Civil from './components/MoreData/Civil'; // Corrected name

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/adminregister' element={<Register />} />
        <Route path='/adminlogin' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />}>
          <Route path='user' element={<UserData />} />
          <Route path='project-tracker' element={<ProjectTracker />} />
          <Route path='project-details/:id' element={<ProjectDetails />} />
          <Route path='archive' element={<ArchiveProject />} /> {/* Corrected 'archieve' to 'archive' */}
          <Route path='finance' element={<Finance />} />
          <Route path='newproject' element={<NewProject />} />
          <Route path='editable' element={<EditableField />} />

          <Route path='project-details/:id/drafter' element={<Drafter />} />
          <Route path='project-details/:id/engineering' element={<Engineering />} />
          <Route path='project-details/:id/mep' element={<Mep />} />
          <Route path='project-details/:id/civil' element={<Civil />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
