import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { useApp } from '../contexts/AppContext';

export interface WorkoutData {
  name: string;
  duration?: number;
  daysOfWeek?: number[];
  color?: string;
}

export function useWorkouts() {
  const { workouts, deviceId } = useApp();

  const addWorkout = async (data: WorkoutData) => {
    try {
      const workoutsRef = collection(db, 'workouts');
      await addDoc(workoutsRef, {
        ...data,
        deviceId,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error adding workout:', error);
    }
  };

  const updateWorkout = async (id: string, data: Partial<WorkoutData>) => {
    try {
      const workoutRef = doc(db, 'workouts', id);
      await updateDoc(workoutRef, data);
    } catch (error) {
      console.error('Error updating workout:', error);
    }
  };

  const deleteWorkout = async (id: string) => {
    try {
      // 1. Delete the workout document
      const workoutRef = doc(db, 'workouts', id);
      await deleteDoc(workoutRef);

      // 2. Query and delete all completions associated with this workout
      const completionsRef = collection(db, 'completions');
      const q = query(
        completionsRef, 
        where('workoutId', '==', id), 
        where('deviceId', '==', deviceId)
      );
      
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const batch = writeBatch(db);
        snapshot.forEach((completionDoc) => {
          batch.delete(completionDoc.ref);
        });
        await batch.commit();
      }
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  return { workouts, addWorkout, updateWorkout, deleteWorkout };
}
