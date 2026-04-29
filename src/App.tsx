import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAppStore } from './stores/useAppStore';
import WelcomePage from './pages/WelcomePage';
import SetupPage from './pages/SetupPage';
import ChatPage from './pages/ChatPage';
import SettingsPage from './pages/SettingsPage';
import VoicePage from './pages/VoicePage';
import Layout from './components/Layout';

function App() {
  const { isInitialized, currentView, setCurrentView, companions } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isInitialized) {
      setCurrentView('welcome');
      navigate('/');
    }
  }, [isInitialized, setCurrentView, navigate]);

  // Auto-navigate to chat if setup is complete
  useEffect(() => {
    if (isInitialized && currentView === 'chat') {
      navigate('/chat');
    }
  }, [isInitialized, currentView, navigate]);

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={
            !isInitialized ? (
              <WelcomePage />
            ) : (
              <Navigate to="/setup" replace />
            )
          }
        />
        <Route
          path="/setup"
          element={<SetupPage />}
        />
        <Route
          path="/chat"
          element={isInitialized ? <ChatPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/settings"
          element={isInitialized ? <SettingsPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/voice"
          element={isInitialized ? <VoicePage /> : <Navigate to="/" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
