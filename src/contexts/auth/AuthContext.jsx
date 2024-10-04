import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  validateLogin,
  saveTokenInLocalStorage,
  getTokenFromLocalStorage,
  trashToken,
} from "../../db";

const checkForToken = () => getTokenFromLocalStorage() || null;

const initialState = {
  user: null,
  isAuthenticated: null,
  token: null,
  msg: null,
};

const AuthContext = createContext(initialState);

const reducer = (state, action) => {
  switch (action.type) {
    case "INITIALIZE_AUTH": {
      saveTokenInLocalStorage(action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload.user,
      };
    }

    case "LOGIN_SUCCESS": {
      console.log(action.payload);
      saveTokenInLocalStorage(action.payload.token);
      return {
        ...state,
        ...action.payload,
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

    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const initializeAuth = useCallback(async () => {
    const existingtoken = checkForToken();
    if (existingtoken) {
      try {
        const { user, token } = await validateLogin({ token: existingtoken });

        if (!user) return;

        dispatch({
          type: "INITIALIZE_AUTH",
          payload: { token, user },
        });
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = useCallback(async (email, password) => {
    try {
      const result = await validateLogin({ email, password });
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: result,
      });
    } catch (error) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: { msg: error.message },
      });
    }
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used within an AuthProvider");

  return context;
}

export { AuthProvider, useAuth };
