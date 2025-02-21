import React, { createContext, useState } from "react";
import { getappData } from "../db";
import defaultappData from "../db/JsonData/appData.json";

export const GlobalContext = createContext(defaultappData);

export default function GlobalProvider({ children }) {
  const [appData, setappData] = useState(() => {
    const extractedData = getappData();
    return extractedData || defaultappData;
  });

  return (
    <GlobalContext.Provider value={{ appData, setappData }}>
      {children}
    </GlobalContext.Provider>
  );
}
