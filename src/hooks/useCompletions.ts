import { collection, addDoc, updateDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useApp } from '../contexts/AppContext';

export function useCompletions() {
  const { completions } = useApp();

  const toggleCompletion = async (workoutId: string, date: string, currentCompleted: boolean) => {
    try {
      const completionsRef = collection(db, 'completions');
      const q = query(
        completionsRef, 
        where('workoutId', '==', workoutId), 
        where('date', '==', date)
      );
      
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        // Create new completion record
        await addDoc(completionsRef, {
          workoutId,
          date,
          completed: true, // Assuming the toggle intention is from uncompleted to completed
          completedAt: new Date().toISOString()
        });
      } else {
        // Update existing completion record
        const completionDoc = snapshot.docs[0];
        const docRef = doc(db, 'completions', completionDoc.id);
        await updateDoc(docRef, {
          completed: !currentCompleted
        });
      }
    } catch (error: any) {
      console.error('Error toggling completion:', error);
      alert('Erreur: ' + error.message);
    }
  };

  const getCompletionsForDate = (date: string) => {
    return completions.filter(c => c.date === date);
  };

  return { toggleCompletion, getCompletionsForDate };
}
