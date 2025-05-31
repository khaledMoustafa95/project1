import { AuthProvider } from "./auth/context/AuthContext";
import AuthStateInitializer from "./auth/components/authStateInitializer";
import AppRoutes from "./AppRoutes";
import "./App.css";
import "./i18n";

function App() {
  // Get i18n instance

  return (
    <AuthProvider>
      <AuthStateInitializer>
        <AppRoutes />
      </AuthStateInitializer>
    </AuthProvider>
  );
}

export default App;
