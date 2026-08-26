import { useEffect, createContext, useState } from "react";
import { themes } from "../theme/initThemes";
import { merge } from "lodash";

const getSavedSidenavMode = () => {
  try {
    const saved = localStorage.getItem("sidenav_mode");
    if (saved && (saved === "full" || saved === "compact")) {
      return saved;
    }
  } catch (e) {
    console.error("Error reading sidenav_mode from localStorage", e);
  }
  return null;
};

let initialSettings = {
  showSidebar: true,
  showHeader: true,
  windowWidth: window.innerWidth,
  activeLayout: "layout1", // layout1, layout2
  activeTheme: "blue", // View all valid theme colors inside Theme/themeColors.js
  perfectScrollbar: false,

  themes: themes,
  layout1Settings: {
    leftSidebar: {
      show: true,
      mode: getSavedSidenavMode() || "compact", // full, close, compact, mobile,
      theme: "whiteBlue", // View all valid theme colors inside Theme/themeColors.js
      bgImgURL: "/assets/images/sidebar/sidebar-bg-dark.jpg"
    },
    topbar: {
      show: true,
      fixed: true,
      theme: "whiteBlue" // View all valid theme colors inside Theme/themeColors.js
    }
  }, // open Layout1/Layout1Settings.js

  secondarySidebar: {
    show: true,
    open: false,
    theme: "slateDark1" // View all valid theme colors inside Theme/themeColors.js
  }
};

export const SettingsContext = createContext({
  settings: initialSettings,
  updateSettings: () => {}
});

export default function SettingsProvider({ settings, children }) {
  const [currentSettings, setCurrentSettings] = useState(() => {
    const defaultSettings = settings || initialSettings;
    const savedMode = getSavedSidenavMode();
    if (savedMode && defaultSettings?.layout1Settings?.leftSidebar) {
      return merge({}, defaultSettings, {
        layout1Settings: { leftSidebar: { mode: savedMode } }
      });
    }
    return defaultSettings;
  });

  useEffect(() => {
    const handleResize = () => {
      setCurrentSettings((prevSettings) => ({
        ...prevSettings,
        windowWidth: window.innerWidth
      }));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const mode = currentSettings?.layout1Settings?.leftSidebar?.mode;
    if (mode && (mode === "full" || mode === "compact")) {
      try {
        localStorage.setItem("sidenav_mode", mode);
      } catch (e) {
        console.error("Error saving sidenav_mode to localStorage", e);
      }
    }
  }, [currentSettings?.layout1Settings?.leftSidebar?.mode]);

  const handleUpdateSettings = (update = {}) => {
    const marged = merge({}, currentSettings, update);
    setCurrentSettings(marged);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings: currentSettings,
        updateSettings: handleUpdateSettings
      }}>
      {children}
    </SettingsContext.Provider>
  );
}

