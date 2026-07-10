import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import Layout from './components/Layout';
import TodayPage from './pages/TodayPage';
import ManagePage from './pages/ManagePage';
import StatsPage from './pages/StatsPage';
import PinScreen from './components/PinScreen';

function AppContent() {
  const { loading, error } = useApp();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('tracker_authenticated') === 'true';
  });

  if (!isAuthenticated) {
    return <PinScreen onSuccess={() => setIsAuthenticated(true)} />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-slate-50">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-lg font-bold mb-2 text-slate-900">Erreur de connexion</h2>
        <p className="text-sm mb-4 text-slate-500">{error}</p>
        <p className="text-xs text-slate-400">
          Vérifiez vos règles Firestore:<br/>
          allow read, write: if true;
        </p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<TodayPage />} />
          <Route path="/manage" element={<ManagePage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
