import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useApp } from '../contexts/AppContext';

export function useCompletions() {
  const { completions } = useApp();

  const incrementCompletion = async (workoutId: string, date: string) => {
    try {
      const completionsRef = collection(db, 'completions');
      const q = query(
        completionsRef, 
        where('workoutId', '==', workoutId), 
        where('date', '==', date)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        await addDoc(completionsRef, {
          workoutId,
          date,
          count: 1,
          updatedAt: new Date().toISOString()
        });
      } else {
        const completionDoc = snapshot.docs[0];
        const docRef = doc(db, 'completions', completionDoc.id);
        const data = completionDoc.data();
        await updateDoc(docRef, {
          count: (data.count || 0) + 1,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error: any) {
      console.error('Error incrementing completion:', error);
      alert('Erreur: ' + error.message);
    }
  };

  const decrementCompletion = async (workoutId: string, date: string) => {
    try {
      const completionsRef = collection(db, 'completions');
      const q = query(
        completionsRef, 
        where('workoutId', '==', workoutId), 
        where('date', '==', date)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const completionDoc = snapshot.docs[0];
        const docRef = doc(db, 'completions', completionDoc.id);
        const data = completionDoc.data();
        const newCount = Math.max(0, (data.count || 0) - 1);
        
        if (newCount === 0) {
          await deleteDoc(docRef);
        } else {
          await updateDoc(docRef, {
            count: newCount,
            updatedAt: new Date().toISOString()
          });
        }
      }
    } catch (error: any) {
      console.error('Error decrementing completion:', error);
      alert('Erreur: ' + error.message);
    }
  };

  const resetCompletion = async (workoutId: string, date: string) => {
    try {
      const completionsRef = collection(db, 'completions');
      const q = query(
        completionsRef, 
        where('workoutId', '==', workoutId), 
        where('date', '==', date)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const completionDoc = snapshot.docs[0];
        const docRef = doc(db, 'completions', completionDoc.id);
        await deleteDoc(docRef);
      }
    } catch (error: any) {
      console.error('Error resetting completion:', error);
      alert('Erreur: ' + error.message);
    }
  };

  const getCompletionCount = (workoutId: string, date: string): number => {
    const comp = completions.find(c => c.workoutId === workoutId && c.date === date);
    return comp?.count || 0;
  };

  return { incrementCompletion, decrementCompletion, resetCompletion, getCompletionCount };
}
