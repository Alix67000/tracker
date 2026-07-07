import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { useApp } from '../contexts/AppContext';

export interface WorkoutData {
  name: string;
  repetitions?: number;
  daysOfWeek?: number[];
  color?: string;
}

export function useWorkouts() {
  const { workouts } = useApp();

  const addWorkout = async (data: WorkoutData) => {
    try {
      const workoutsRef = collection(db, 'workouts');
      await addDoc(workoutsRef, {
        ...data,
        createdAt: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Error adding workout:', error);
      alert('Erreur: ' + error.message);
    }
  };

  const updateWorkout = async (id: string, data: Partial<WorkoutData>) => {
    try {
      const workoutRef = doc(db, 'workouts', id);
      await updateDoc(workoutRef, data);
    } catch (error: any) {
      console.error('Error updating workout:', error);
      alert('Erreur: ' + error.message);
    }
  };

  const deleteWorkout = async (id: string) => {
    try {
      const workoutRef = doc(db, 'workouts', id);
      await deleteDoc(workoutRef);

      const completionsRef = collection(db, 'completions');
      const q = query(
        completionsRef, 
        where('workoutId', '==', id)
      );
      
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const batch = writeBatch(db);
        snapshot.forEach((completionDoc) => {
          batch.delete(completionDoc.ref);
        });
        await batch.commit();
      }
    } catch (error: any) {
      console.error('Error deleting workout:', error);
      alert('Erreur: ' + error.message);
    }
  };

  return { workouts, addWorkout, updateWorkout, deleteWorkout };
}
