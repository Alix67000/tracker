import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { getTodayISO } from '../utils/date';

export interface AppState {
  workouts: any[];
  completions: any[];
  currentDate: string;
  loading: boolean;
  deviceId: string;
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

function getDeviceId() {
  let id = localStorage.getItem('tracker-device-id');
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
    localStorage.setItem('tracker-device-id', id);
  }
  return id;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [completions, setCompletions] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState(getTodayISO());
  const [loading, setLoading] = useState(true);
  const [deviceId] = useState(getDeviceId());

  useEffect(() => {
    // Listen to workouts
    const workoutsRef = collection(db, 'workouts');
    const qWorkouts = query(workoutsRef, where('deviceId', '==', deviceId));
    
    const unsubscribeWorkouts = onSnapshot(qWorkouts, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWorkouts(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching workouts:", error);
      setLoading(false);
    });

    // Listen to completions
    const completionsRef = collection(db, 'completions');
    const qCompletions = query(completionsRef, where('deviceId', '==', deviceId));

    const unsubscribeCompletions = onSnapshot(qCompletions, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCompletions(data);
    }, (error) => {
      console.error("Error fetching completions:", error);
    });

    return () => {
      unsubscribeWorkouts();
      unsubscribeCompletions();
    };
  }, [deviceId]);

  return (
    <AppContext.Provider value={{
      workouts,
      completions,
      currentDate,
      loading,
      deviceId,
      setCurrentDate
    }}>
      {children}
    </AppContext.Provider>
  );
}
