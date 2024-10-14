import { useContext } from "react";
import { SettingsContext } from "contexts/SettingsContext";

const useSettings = () => {
  let settings = useContext(SettingsContext);
  if (settings === undefined)
    throw new Error("AuthContext was used outside of SettingsProvider");
  return settings;
};

export default useSettings;
