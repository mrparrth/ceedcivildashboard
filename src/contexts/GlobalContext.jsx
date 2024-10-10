import React, { createContext, useContext, useState, useEffect } from "react";
import { runScriptFunction } from "../db";

const GlobalContext = createContext();

export const useGlobal = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  const [metadata, setMetadata] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMetadata = async () => {
      const savedMetadata = localStorage.getItem("ceedCivil_Metadata");

      if (savedMetadata) {
        setMetadata(JSON.parse(savedMetadata));
        setIsLoading(false);
      } else {
        try {
          // If not in localStorage, fetch from API
          const data = await runScriptFunction("getMetadata");

          setMetadata(data);

          localStorage.setItem("ceedCivil_Metadata", JSON.stringify(data));
        } catch (error) {
          console.error("Error fetching metadata:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadMetadata();
  }, []);

  return (
    <GlobalContext.Provider value={{ metadata, isLoading }}>
      {children}
    </GlobalContext.Provider>
  );
};
