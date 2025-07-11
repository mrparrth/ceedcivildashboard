import { createContext, useReducer, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveTokenInLocalStorage, getTokenFromLocalStorage, trashToken, runScriptFunction } from "../../db";
import useContractMetadata from "hooks/useContractMetadata";

const checkForToken = () => getTokenFromLocalStorage() || null;

const initialState = {
  user: null,
  isAuthenticated: false,
  token: null,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "INITIALIZE_AUTH": {
      saveTokenInLocalStorage(action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload.user
          ? {
              ...action.payload.user,
              role: action.payload.user.role ? action.payload.user.role.toUpperCase() : action.payload.user.role,
            }
          : action.payload.user,
      };
    }

    case "LOGIN_SUCCESS": {
      saveTokenInLocalStorage(action.payload.token);
      return {
        ...state,
        ...action.payload,
        user: action.payload.user
          ? {
              ...action.payload.user,
              role: action.payload.user.role ? action.payload.user.role.toUpperCase() : action.payload.user.role,
            }
          : action.payload.user,
        isAuthenticated: true,
      };
    }

    case "LOGIN_FAILURE": {
      return {
        ...state,
        ...action.payload,
        isAuthenticated: false,
      };
    }

    case "LOGOUT": {
      trashToken();
      return initialState;
    }

    case "SET_ERROR": {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
};

export const AuthContext = createContext(initialState);

export default function AuthProvider({ children }) {
  useContractMetadata(); //initializes the contract metadata

  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isAuthInProgress, setAuthInProgress] = useState(false);

  const initializeAuth = useCallback(async () => {
    const existingtoken = checkForToken();
    if (!existingtoken) return;

    if (existingtoken) {
      setAuthInProgress(true);
      try {
        const { user, token } = await runScriptFunction("login");
        if (!user) return;

        dispatch({
          type: "INITIALIZE_AUTH",
          payload: { token, user },
        });
      } catch (error) {
        dispatch({
          type: "LOGIN_FAILURE",
          payload: { error: error.message },
        });
      } finally {
        setAuthInProgress(false);
      }
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = async (email, password) => {
    setAuthInProgress(true);
    try {
      let result = await runScriptFunction("login", { email, password });
      if (!result.user) throw new Error("Some problem occured");

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: result,
      });
    } catch (error) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: { error: error.message },
      });
    } finally {
      setAuthInProgress(false);
    }
  };

  const logout = useCallback(() => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  }, []);

  const setError = (error) => {
    dispatch({ type: "SET_ERROR", payload: { error } });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        isAuthInProgress,
        login,
        logout,
        setError,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
