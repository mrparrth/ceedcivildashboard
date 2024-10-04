import Button from "@mui/material/Button";
import { MdDashboard } from "react-icons/md";
import { IoArchive } from "react-icons/io5";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { IoIosSettings } from "react-icons/io";
import { Link } from "react-router-dom";
import { useState } from "react";
import { IoMdLogOut } from "react-icons/io";
import { useContext, useState } from "react";
import { Dashboard } from "@mui/icons-material";
import { useSettings } from "../contexts/SettingsContext";
import { FaFileContract } from "react-icons/fa";
import Divider from "@mui/material/Divider";
import { TbHexagonLetterPFilled, TbHexagonLetterAFilled } from "react-icons/tb";
import { useAuth } from "../contexts/auth/AuthContext";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState(null);
  const { settings, updateSettings } = useSettings();
  const { logout } = useAuth();
  const showReducedIcons = settings.windowWidth < 992;
  const poleBarnFormUrl =
    "script.google.com/macros/s/AKfycbwlMhk694ZaK0lvZ-QK_CRzBmAYCpLru11AcS3cxV42B5Qt3lANM0kARfFbAdv6xdi--A/exec";
  const aFrameFormUrl =
    "script.google.com/macros/s/AKfycbx4Gx__TTGsrecDH2O8567811P72n942pRPlLrYbbMXK3Ng7HXzqKdqenUxdGsb6tOGGg/exec";

  const openInNewTab = (url) =>
    window.open(ensureHttps(url), "_blank", "noopener,noreferrer");
  const ensureHttps = (url) => {
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

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
                {!showReducedIcons && "Dashboard"}
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/archived">
              <Button
                className={`w-100 ${activeTab === 1 ? "active" : ""}`}
                onClick={() => setActiveTab(1)}
              >
                <span className="icon">
                  <IoArchive />
                </span>
                {!showReducedIcons && "Archived"}
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/finance">
              <Button
                className={`w-100 ${activeTab === 2 ? "active" : ""}`}
                onClick={() => setActiveTab(2)}
              >
                <span className="icon">
                  <FaMoneyCheckDollar />
                </span>
                {!showReducedIcons && "Finance"}
              </Button>
            </Link>
          </li>
          <Divider variant="middle" style={{ backgroundColor: "rgb(0 0 0)" }} />
          <li>
            <Link to="/contract-generator-tool">
              <Button
                className={`w-100 ${activeTab === 3 ? "active" : ""}`}
                onClick={() => setActiveTab(3)}
              >
                <span className="icon">
                  <FaFileContract />
                </span>
                {!showReducedIcons && "Contract Form"}
              </Button>
            </Link>
          </li>
          <li>
            <a
              href={ensureHttps(poleBarnFormUrl)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                openInNewTab(poleBarnFormUrl);
              }}
            >
              <Button>
                <span className="icon">
                  <TbHexagonLetterPFilled />
                </span>
                {!showReducedIcons && "Pole Barn Form"}
              </Button>
            </a>
          </li>
          <li>
            <a
              href={ensureHttps(aFrameFormUrl)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                openInNewTab(aFrameFormUrl);
              }}
            >
              <Button>
                <span className="icon">
                  <TbHexagonLetterAFilled />
                </span>
                {!showReducedIcons && "A Frame Form"}
              </Button>
            </a>
          </li>
          <Divider variant="middle" style={{ backgroundColor: "rgb(0 0 0)" }} />
          <li>
            <Link to="/">
              <Button
                className={`w-100 ${activeTab === 4 ? "active" : ""}`}
                onClick={() => setActiveTab(4)}
              >
                <span className="icon">
                  <IoIosSettings />
                </span>
                {!showReducedIcons && "Settings"}
              </Button>
            </Link>
          </li>
        </ul>
        <br />
        {!showReducedIcons && (
          <div className="logoutWrapper">
            <div className="logoutBox">
              <Button variant="contained" onClick={logout}>
                <IoMdLogOut /> Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
