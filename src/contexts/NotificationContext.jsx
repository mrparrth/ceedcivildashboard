import { createContext, useEffect, useReducer, useContext } from "react";
import shortId from "shortid";

const initialState = {
  notifications: [],
  currentPopup: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOAD_NOTIFICATIONS":
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: action.payload,
        currentPopup: action.payload[0],
      };
    case "DELETE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter(
          (n) => n.id !== action.payload
        ),
        currentPopup: null,
      };
    case "CLEAR_NOTIFICATIONS":
      return { ...state, notifications: [], currentPopup: null };
    case "HIDE_POPUP":
      return { ...state, currentPopup: null };
    default:
      return state;
  }
};

const getIconDetails = (type = "") => {
  switch (type.toLowerCase()) {
    case "message":
      return { name: "chat", color: "primary" };
    case "alert":
      return { name: "notifications", color: "error" };
    default:
      return { name: "info", color: "info" };
  }
};

export const NotificationContext = createContext(null);

export default function NotificationProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const deleteNotification = (id) => {
    dispatch({ type: "DELETE_NOTIFICATION", payload: id });
  };

  const clearNotifications = () => {
    dispatch({ type: "CLEAR_NOTIFICATIONS" });
  };

  const addNotification = ({ type, title, subtitle, path }) => {
    if (!type) type = "message";
    const newNotification = {
      id: shortId.generate(),
      heading: type,
      icon: getIconDetails(type),
      timestamp: Date.now(),
      title,
      subtitle,
      path: path || "#",
    };
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: [newNotification, ...state.notifications],
    });
  };

  const hidePopup = () => {
    dispatch({
      type: "HIDE_POPUP",
    });
  };
  useEffect(() => {
    // You can load initial notifications here if needed
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        ...state,
        deleteNotification,
        clearNotifications,
        addNotification,
        hidePopup,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
