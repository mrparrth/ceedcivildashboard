import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { RiMenu2Line, RiCloseLine } from "react-icons/ri";
import axios from "axios";

axios.defaults.withCredentials = true;

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const menuItems = [
    { to: "/dashboard/project-tracker", icon: "bi-speedometer2", label: "Dashboard" },
    { to: "/dashboard/finance", icon: "bi-people", label: "Finance" },
    { to: "/dashboard/archieve", icon: "bi-columns", label: "Archive project" },
    { to: "#", icon: "bi-power", label: "Logout" },
  ];

  return (
    <div className="flex">
      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-68 sm:w-65 h-screen transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } sm:translate-x-0 bg-gray-800 dark:bg-gray-800`}>
        <div className="flex justify-between items-center p-4">
          <img
            src="https://ceedcivil.com/wp-content/uploads/thegem-logos/logo_4d56f686668bce5695ed72f5ec338800_1x.png"
            alt="CeedCivil Logo"
            className="ml-10 mt-5 w-[100px] h-[100px] p-2 bg-white rounded-full"
          />
          <RiCloseLine
            className="w-20 h-20 sm:hidden text-white  ml-5 p-2 hover:text-gray-300 cursor-pointer absolute top-1 right-0"
            onClick={toggleSidebar}
          />
        </div>

        <ul className="flex flex-col items-center sm:items-start">
          {menuItems.map(({ to, icon, label }) => (
            <li key={label} className="w-full p-4">
              <Link to={to} className="text-white px-0 align-middle flex items-center" onClick={toggleSidebar}>
                <i className={`text-4xl ${icon} ml-2`}></i>
                <span className="ml-2 text-[20px]">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      <div className=" sm:ml-[180px] flex-1 relative">
        <button
          aria-controls="logo-sidebar"
          className="absolute top-7 left-4 h-[40px] w-[40px] text-white sm:hidden focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600"
          onClick={toggleSidebar}>
          <RiMenu2Line className="w-10 h-10" />
        </button>

        <div className="  rounded-lg dark:border-gray-700">
          <div className="flex items-center justify-center h-24 mb-4 rounded bg-gray-800 dark:bg-gray-800">
            <h4 className="text-[18px] sm:text-[18px] md:text-[30px] font-semibold text-center text-white flex-grow">
              {/* Welcome to CeedCivil */}
            </h4>

            
              <Link to="/dashboard/newproject" className="text-white cursor-pointer">
              <button className="h-[40px] bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 mr-5 rounded">
                New Project
                </button>
              </Link>
            
          </div>

          <div className="flex items-center justify-center h-[600px] dark:bg-gray-800  rounded ">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
