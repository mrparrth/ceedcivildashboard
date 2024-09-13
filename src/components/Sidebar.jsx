import Button from "@mui/material/Button";
import { MdDashboard } from "react-icons/md";
import { IoArchive } from "react-icons/io5";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { IoIosSettings } from "react-icons/io";
import { Link } from "react-router-dom";
import { useState } from "react";
import { IoMdLogOut } from "react-icons/io";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <div className="sidebar">
        <ul>
          <li>
            <Link to="/">
              <Button
                className={`w-100 ${activeTab === 0 ? "active" : ""}`}
                onClick={() => setActiveTab(0)}
              >
                <span className="icon">
                  <MdDashboard />
                </span>
                Dashboard
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/">
              <Button
                className={`w-100 ${activeTab === 1 ? "active" : ""}`}
                onClick={() => setActiveTab(1)}
              >
                <span className="icon">
                  <IoArchive />
                </span>
                Archived
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/">
              <Button
                className={`w-100 ${activeTab === 2 ? "active" : ""}`}
                onClick={() => setActiveTab(2)}
              >
                <span className="icon">
                  <FaMoneyCheckDollar />
                </span>
                Finance
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/">
              <Button
                className={`w-100 ${activeTab === 3 ? "active" : ""}`}
                onClick={() => setActiveTab(3)}
              >
                <span className="icon">
                  <IoIosSettings />
                </span>
                Settings
              </Button>
            </Link>
          </li>
        </ul>
        <br />

        <div className="logoutWrapper">
          <div className="logoutBox">
            <Button variant="contained">
              <IoMdLogOut /> Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
