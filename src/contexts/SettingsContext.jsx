import { useContext, useEffect } from "react";
import { createContext, useState } from "react";

let initialSettings = {
  showSidebar: true,
  showHeader: true,
  windowWidth: window.innerWidth,
};

const SettingsContext = createContext({
  settings: initialSettings,
  updateSettings: () => {},
});

function SettingsProvider({ settings, children }) {
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
    const marged = { ...currentSettings, ...update }; //merge({}, currentSettings, update);
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

const useSettings = () => {
  let settings = useContext(SettingsContext);
  if (settings === undefined)
    throw new Error("AuthContext was used outside of SettingsProvider");
  return settings;
};
export { useSettings, SettingsProvider };
