import { useRoutes } from "react-router-dom";
import { SettingsProvider } from "./contexts/SettingsContext";
import { AuthProvider } from "./contexts/auth/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import routes from "./routes";

function App() {
  const content = useRoutes(routes);
  return (
    <SettingsProvider>
      <AuthProvider>
        <DataProvider>
          {/* <AppContent /> */}
          {content}
        </DataProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}

export default App;
