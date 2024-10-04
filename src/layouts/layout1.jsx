import Header from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useSettings } from "../contexts/SettingsContext";
import { Outlet } from "react-router-dom";

const Layout1 = () => {
  const { settings } = useSettings();

  return (
    <>
      {settings.showHeader && <Header />}
      <div className="main d-flex">
        {settings.showSidebar && (
          <div
            className={`sidebarWrapper ${
              !settings.showSidebar ? "toggle" : ""
            }`}
          >
            <Sidebar />
          </div>
        )}

        <div
          className={`content ${!settings.showHeader && "full"} ${
            !settings.showSidebar ? "toggle" : ""
          }`}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout1;
