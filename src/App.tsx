import "./App.css";
import { AuthProvider, useAuthContext } from "./contexts/AuthContext";
import { useSessionStorage } from "./hooks/useSessionStorage";
import Login from "./pages/LoginPage/Login";
import { AuthStatus } from "./services/authApi";

function AppContent() {
  const { auth, setAuth } = useAuthContext();
  const { isAuthenticated, user, clearToken } = useSessionStorage();

  if (!auth.isInitialized) {
    return (
      <div className="app-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const handleLogout = () => {
    clearToken();
    setAuth({
      phoneNumber: "",
      isLoading: false,
      error: "",
      status: AuthStatus.VERIFY,
    });
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Dynamic QR Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="qr-section">
          <h2>Your QR Code</h2>
          <div className="qr-placeholder">
            <p>QR Code will be generated here</p>
            <small>Dynamic QR functionality coming soon...</small>
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
