import { useContext } from "react";
import { GlobalContext } from "contexts/GlobalContext";

const useAppData = () => {
  let context = useContext(GlobalContext);
  if (context === undefined)
    throw new Error("AuthContext was used outside of SettingsProvider");
  return context;
};

export default useAppData;
