import { useRoutes } from "react-router-dom";
import { SettingsProvider } from "./contexts/SettingsContext";
import { AuthProvider } from "./contexts/auth/AuthContext";
import { DataProvider } from "./contexts/data/DataContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { GlobalProvider } from "./contexts/GlobalContext";
import routes from "./routes";

function App() {
  const content = useRoutes(routes);
  return (
    <GlobalProvider>
      <SettingsProvider>
        <AuthProvider>
          <NotificationProvider>
            <DataProvider>{content}</DataProvider>
          </NotificationProvider>
        </AuthProvider>
      </SettingsProvider>
    </GlobalProvider>
  );
}

export default App;
