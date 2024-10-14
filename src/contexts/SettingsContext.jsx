import { useEffect } from "react";
import { createContext, useState } from "react";
import { themes } from "../theme/initThemes";
import { merge } from "lodash";

let initialSettings = {
  showSidebar: true,
  showHeader: true,
  windowWidth: window.innerWidth,
  activeLayout: "layout1", // layout1, layout2
  activeTheme: "blue", // View all valid theme colors inside MatxTheme/themeColors.js
  perfectScrollbar: false,

  themes: themes,
  layout1Settings: {
    leftSidebar: {
      show: true,
      mode: "full", // full, close, compact, mobile,
      theme: "slateDark1", // View all valid theme colors inside MatxTheme/themeColors.js
      bgImgURL: "/assets/images/sidebar/sidebar-bg-dark.jpg",
    },
    topbar: {
      show: true,
      fixed: true,
      theme: "whiteBlue", // View all valid theme colors inside MatxTheme/themeColors.js
    },
  }, // open Layout1/Layout1Settings.js

  secondarySidebar: {
    show: true,
    open: false,
    theme: "slateDark1", // View all valid theme colors inside MatxTheme/themeColors.js
  },
};

export const SettingsContext = createContext({
  settings: initialSettings,
  updateSettings: () => {},
});

export default function SettingsProvider({ settings, children }) {
  const [currentSettings, setCurrentSettings] = useState(
    settings || initialSettings
  );

  useEffect(() => {
    const handleResize = () => {
      setCurrentSettings((prevSettings) => ({
        ...prevSettings,
        windowWidth: window.innerWidth,
      }));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleUpdateSettings = (update = {}) => {
    const marged = merge({}, currentSettings, update);
    setCurrentSettings(marged);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings: currentSettings,
        updateSettings: handleUpdateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
