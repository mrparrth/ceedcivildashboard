import React, {
  createContext,
  useReducer,
  useEffect,
  useState,
  useCallback
} from "react";
import { dataReducer, initialState } from "./dataReducer";
import { runScriptFunction } from "../../db/index";
import { useQueueManager } from "./queueManager";
import {
  createProject,
  updateProject,
  deleteProject,
  archiveProjects,
  unarchiveProjects,
  createDropboxFolder,
  toggleProjectSelection
} from "./projectOperations";
import {
  createPayment,
  updatePayment,
  deletePayment,
  createFbExpense
} from "./paymentOperations";

import useNotification from "hooks/useNotification";
import useAuth from "hooks/useAuth";

export const DataContext = createContext(initialState);

export default function DataProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const { addNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [state, dispatch] = useReducer(dataReducer, initialState);

  const { addToQueue, processQueue, requestQueue } =
    useQueueManager(addNotification);

  const initializeData = useCallback(async () => {
    if (isAuthenticated) {
      try {
        setIsLoading(true);
        const data = await runScriptFunction("getSheetData");
        dispatch({ type: "SET_INITIAL_DATA", payload: data });
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    initializeData();
  }, [initializeData, user]);

  useEffect(() => {
    if (requestQueue.length > 0) {
      processQueue();
    }
  }, [requestQueue, processQueue]);

  useEffect(() => {
    if (error) {
      addNotification({ title: error, type: "alert" });
    }
  }, [error]);

  const refreshData = useCallback(async () => {
    while (requestQueue.length > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    await initializeData();
  }, [initializeData, requestQueue]);

  const contextValue = {
    ...state,
    error,
    isLoading,
    refreshData,
    toggleProjectSelection: toggleProjectSelection(dispatch),
    createProject: createProject(dispatch, addToQueue, user, addNotification),
    updateProject: updateProject(dispatch, state.projects, addToQueue),
    deleteProject: deleteProject(dispatch, addToQueue),
    archiveProjects: archiveProjects(dispatch, addToQueue),
    unarchiveProjects: unarchiveProjects(dispatch, addToQueue),
    createDropboxFolder: createDropboxFolder(dispatch, addNotification),
    createPayment: createPayment(dispatch, addToQueue),
    updatePayment: updatePayment(dispatch, addToQueue),
    deletePayment: deletePayment(dispatch, addToQueue),
    createFbExpense: createFbExpense(dispatch)
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
}
