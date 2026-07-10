import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { getTodayISO } from '../utils/date';

export interface AppState {
  workouts: any[];
  completions: any[];
  setCompletions: React.Dispatch<React.SetStateAction<any[]>>;
  currentDate: string;
  loading: boolean;
  error: string | null;
  setCurrentDate: (date: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [completions, setCompletions] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState(getTodayISO());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let workoutsLoaded = false;
    let completionsLoaded = false;

    const checkLoading = () => {
      if (workoutsLoaded && completionsLoaded) {
        setLoading(false);
      }
    };

    const workoutsRef = collection(db, 'workouts');
    const unsubscribeWorkouts = onSnapshot(workoutsRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWorkouts(data);
      workoutsLoaded = true;
      checkLoading();
    }, (err: any) => {
      console.error("Error fetching workouts:", err);
      setError(err.message);
      workoutsLoaded = true;
      checkLoading();
    });

    const completionsRef = collection(db, 'completions');
    const unsubscribeCompletions = onSnapshot(completionsRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCompletions(data);
      completionsLoaded = true;
      checkLoading();
    }, (err: any) => {
      console.error("Error fetching completions:", err);
      setError(err.message);
      completionsLoaded = true;
      checkLoading();
    });

    return () => {
      unsubscribeWorkouts();
      unsubscribeCompletions();
    };
  }, []);

  return (
    <AppContext.Provider value={{
      workouts,
      completions,
      setCompletions,
      currentDate,
      loading,
      error,
      setCurrentDate
    }}>
      {children}
    </AppContext.Provider>
  );
}
