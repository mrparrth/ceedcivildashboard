import { DataContext } from "contexts/data/DataContext";
import { useContext } from "react";

const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export default useData;
