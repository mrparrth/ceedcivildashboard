import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useAuth } from "./auth/AuthContext";
import { getProjects, getSheetData, runScriptFunction } from "../db/index";
import debounce from "lodash/debounce";

const initialState = {
  projects: [],
  metadata: {},
  payments: [],
};

const DataContext = createContext(initialState);

const DataProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestQueue, setRequestQueue] = useState([]);

  const addToQueue = (functionName, data) => {
    setRequestQueue((prevQueue) => [
      ...prevQueue,
      { functionName, data, retryCount: 0 },
    ]);
  };

  const debouncedAddToQueue = debounce(addToQueue, 5000);

  const reducer = (state, action) => {
    let newState;
    let projectData;
    switch (action.type) {
      case "SET_INITIAL_DATA":
        newState = { ...state, ...action.payload };
        break;
      case "ADD_PROJECT":
        projectData = action.payload;
        projectData.createdBy = user?.name;
        projectData.modifiedBy = user?.name;
        newState = {
          ...state,
          projects: [...state.projects, projectData],
        };
        addToQueue("createProject", projectData);
        break;
      case "UPDATE_PROJECT":
        projectData = action.payload;
        projectData.dateModified = new Date().toISOString();
        projectData.modifiedBy = user?.name;
        newState = {
          ...state,
          projects: state.projects.map((project) =>
            project.id === action.payload.id
              ? {
                  ...project,
                  ...projectData,
                }
              : project
          ),
        };
        debouncedAddToQueue("updateProject", action.payload);
        break;
      case "UPDATE_METADATA":
        newState = {
          ...state,
          metadata: {
            ...state.metadata,
            ...action.payload,
          },
        };
        addToQueue("updateMetadata", action.payload);
        break;
      default:
        newState = state;
    }
    return newState;
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initializeData = async () => {
      if (isAuthenticated) {
        try {
          setIsLoading(true);
          const initialData = await getSheetData();
          dispatch({ type: "SET_INITIAL_DATA", payload: initialData });
        } catch (error) {
          console.error("Error fetching initial data:", error);
          setError(error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (requestQueue.length > 0) {
      processQueue();
    }
  }, [requestQueue]);

  const processQueue = async () => {
    if (requestQueue.length === 0) return;

    const { functionName, data, retryCount } = requestQueue[0];
    try {
      console.log(`Processing ${functionName}`);
      await runScriptFunction(functionName, data);
      setRequestQueue((prevQueue) => prevQueue.slice(1));
    } catch (error) {
      console.error(`Error processing ${functionName}:`, error);
      if (retryCount >= 4) {
        console.log(`Removing ${functionName} from queue after 5 attempts.`);
        setRequestQueue((prevQueue) => prevQueue.slice(1));
      } else {
        setRequestQueue((prevQueue) => [
          ...prevQueue.slice(1),
          { ...prevQueue[0], retryCount: retryCount + 1 },
        ]);
      }
    }
  };

  const createProject = (newProject) => {
    const projectWithDates = {
      ...newProject,
      id: crypto.randomUUID(),
      dateCreated: new Date().toISOString(),
      dateModified: new Date().toISOString(),
    };
    dispatch({ type: "ADD_PROJECT", payload: projectWithDates });
  };

  const updateProject = (updatedProject) => {
    dispatch({ type: "UPDATE_PROJECT", payload: updatedProject });
  };

  const deleteProject = (projectId) => {
    dispatch({
      type: "UPDATE_PROJECT",
      payload: { id: projectId, isDeleted: true },
    });
  };

  const archiveProject = (projectId) => {
    dispatch({
      type: "UPDATE_PROJECT",
      payload: { id: projectId, isArchived: true, isSelected: false },
    });
  };

  const unarchiveProject = (projectId) => {
    dispatch({
      type: "UPDATE_PROJECT",
      payload: { id: projectId, isArchived: false, isSelected: false },
    });
  };

  const updateMetadata = (keyValuePairs) => {
    dispatch({ type: "UPDATE_METADATA", payload: keyValuePairs });
  };

  const createDropboxFolder = (projectId, folderPath) => {
    dispatch({
      type: "UPDATE_PROJECT",
      payload: {
        id: projectId,
        dropboxFilesFolder: folderPath,
        isSelected: false,
      },
    });
  };

  return (
    <DataContext.Provider
      value={{
        ...state,
        error,
        isLoading,
        createProject,
        updateProject,
        deleteProject,
        archiveProject,
        unarchiveProject,
        createDropboxFolder,
        updateMetadata,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}

export { DataProvider, useData };
