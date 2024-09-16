import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProjectTracker from "./pages/ProjectTracker";
import Header from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { createContext, useEffect, useState, useMemo } from "react";
import Login from "./pages/Login";
import projectsData from "./data/JsonData/projects.json";
import metadata from "./data/JsonData/metadata.json";

const GlobalContext = createContext();
const DataContext = createContext();

window.MetaData = metadata;

function App() {
  const [isToggleSidebar, setIsToggleSidebar] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isHideSidebarAndHeader, setisHideSidebarAndHeader] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isOpenNav, setIsOpenNav] = useState(false);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );
  const [projects, setProjects] = useState(projectsData);

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const openNav = () => {
    setIsOpenNav(true);
  };

  const values = useMemo(
    () => ({
      isToggleSidebar,
      setIsToggleSidebar,
      isLogin,
      setIsLogin,
      isHideSidebarAndHeader,
      setisHideSidebarAndHeader,
      theme,
      setTheme,
      windowWidth,
      openNav,
      isOpenNav,
      setIsOpenNav,
    }),
    [
      isToggleSidebar,
      isLogin,
      isHideSidebarAndHeader,
      theme,
      windowWidth,
      isOpenNav,
    ]
  );

  return (
    <BrowserRouter>
      <GlobalContext.Provider value={values}>
        <DataContext.Provider value={{ projects, setProjects }}>
          {isHideSidebarAndHeader !== true && <Header />}

          <div className="main d-flex">
            {isHideSidebarAndHeader !== true && (
              <>
                <div
                  className={`sidebarOverlay d-none ${
                    isOpenNav === true && "show"
                  }`}
                  onClick={() => setIsOpenNav(false)}
                ></div>
                <div
                  className={`sidebarWrapper ${
                    isToggleSidebar === true ? "toggle" : ""
                  } ${isOpenNav === true ? "open" : ""}`}
                >
                  <Sidebar />
                </div>
              </>
            )}

            <div
              className={`content ${
                isHideSidebarAndHeader === true && "full"
              } ${isToggleSidebar === true ? "toggle" : ""}`}
            >
              <Routes>
                <Route path="/" exact={true} element={<ProjectTracker />} />
                {/* <Route
                  path="/dashboard"
                  exact={true}
                  element={<ProjectTracker />}
                /> */}
                <Route path="/login" exact={true} element={<Login />} />
              </Routes>
            </div>
          </div>
        </DataContext.Provider>
      </GlobalContext.Provider>
    </BrowserRouter>
  );
}

export default App;
export { GlobalContext, DataContext };
