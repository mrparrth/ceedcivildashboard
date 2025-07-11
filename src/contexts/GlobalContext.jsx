import React, { createContext, useEffect, useState, useReducer } from "react";
import { getappData } from "../db";
import defaultappData from "../db/JsonData/appData.json";
import useAuth from "hooks/useAuth";

export const GlobalContext = createContext(defaultappData);

export default function GlobalProvider({ children }) {
  const { logout } = useAuth();

  const [appData, setappData] = useState(() => {
    const extractedData = getappData();
    return extractedData || defaultappData;
  });

  const [globalError, setGlobalError] = useState(null);

  const showGlobalError = (message, type = "default") => {
    setGlobalError({ message, type });
  };

  const clearGlobalError = () => {
    setGlobalError(null);
  };

  useEffect(() => {
    console.log("GlobalError:", globalError);
  }, [globalError]);

  const handleErrorAction = () => {
    clearGlobalError();
    if (globalError?.type === "credentials") {
      logout();
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        appData,
        setappData,
        showGlobalError,
        clearGlobalError,
      }}>
      {children}
      {globalError && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0">
              <div className="modal-body text-center p-4">
                {globalError.type === "credentials" ? (
                  <div className="mb-4">
                    <div className="alert alert-danger d-inline-block p-3 rounded-circle mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-exclamation-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                        <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
                      </svg>
                    </div>
                    <h4 className="modal-title fw-bold mb-3">Session Expired</h4>
                  </div>
                ) : (
                  <div className="mb-4">
                    <div className="alert alert-warning d-inline-block p-3 rounded-circle mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-exclamation-triangle" viewBox="0 0 16 16">
                        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                      </svg>
                    </div>
                    <h4 className="modal-title fw-bold mb-3">Error</h4>
                  </div>
                )}
                <p className="text-secondary mb-4">{globalError.message}</p>
                <button onClick={handleErrorAction} className={`btn ${globalError.type === "credentials" ? "btn-danger" : "btn-primary"} px-4 py-2`}>
                  {globalError.type === "credentials" ? "Login Again" : "Close"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </GlobalContext.Provider>
  );
}
