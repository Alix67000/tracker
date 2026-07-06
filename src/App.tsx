import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createContext } from 'react';
import Layout from './components/Layout';

// Placholder Context
export const AppContext = createContext({});

function TodayPage() {
  return (
    <div className="page">
      <h2>Aujourd'hui</h2>
      <div className="card">
        <p>Contenu de la page aujourd'hui (Placeholder)</p>
      </div>
    </div>
  );
}

function ManagePage() {
  return (
    <div className="page">
      <h2>Entraînements</h2>
      <div className="card">
        <p>Gérer les entraînements (Placeholder)</p>
      </div>
    </div>
  );
}

function StatsPage() {
  return (
    <div className="page">
      <h2>Statistiques</h2>
      <div className="card">
        <p>Vos statistiques (Placeholder)</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppContext.Provider value={{}}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<TodayPage />} />
            <Route path="/manage" element={<ManagePage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppContext.Provider>
  );
}
