import { doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useApp } from '../contexts/AppContext';

export function useCompletions() {
  const { completions, setCompletions } = useApp();

  const incrementCompletion = async (workoutId: string, date: string) => {
    const existing = completions.find(c => c.workoutId === workoutId && c.date === date);
    const existingId = existing?.id;
    const currentCount = existing?.count || 0;
    const newCount = currentCount + 1;
    const docId = existingId || `${workoutId}_${date}`;

    // 1. Mise à jour optimiste instantanée (0ms)
    setCompletions(prev => {
      const idx = prev.findIndex(c => c.workoutId === workoutId && c.date === date);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], count: newCount };
        return updated;
      } else {
        return [...prev, { id: docId, workoutId, date, count: 1 }];
      }
    });

    // 2. Écriture directe Firestore
    try {
      const docRef = doc(db, 'completions', docId);
      if (existingId) {
        await updateDoc(docRef, {
          count: newCount,
          updatedAt: new Date().toISOString()
        });
      } else {
        await setDoc(docRef, {
          workoutId,
          date,
          count: 1,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error: any) {
      console.error('Error incrementing completion:', error);
      // Annulation en cas d'erreur
      setCompletions(prev => {
        const idx = prev.findIndex(c => c.workoutId === workoutId && c.date === date);
        if (idx > -1) {
          if (currentCount === 0) {
            return prev.filter((_, i) => i !== idx);
          } else {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], count: currentCount };
            return updated;
          }
        }
        return prev;
      });
    }
  };

  const decrementCompletion = async (workoutId: string, date: string) => {
    const existing = completions.find(c => c.workoutId === workoutId && c.date === date);
    if (!existing) return;

    const existingId = existing.id;
    const currentCount = existing.count;
    const newCount = Math.max(0, currentCount - 1);
    const docId = existingId;

    // 1. Mise à jour optimiste instantanée (0ms)
    setCompletions(prev => {
      const idx = prev.findIndex(c => c.workoutId === workoutId && c.date === date);
      if (idx > -1) {
        if (newCount === 0) {
          return prev.filter((_, i) => i !== idx);
        } else {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], count: newCount };
          return updated;
        }
      }
      return prev;
    });

    // 2. Écriture directe Firestore
    try {
      const docRef = doc(db, 'completions', docId);
      if (newCount === 0) {
        await deleteDoc(docRef);
      } else {
        await updateDoc(docRef, {
          count: newCount,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error: any) {
      console.error('Error decrementing completion:', error);
      // Annulation en cas d'erreur
      setCompletions(prev => {
        const idx = prev.findIndex(c => c.workoutId === workoutId && c.date === date);
        if (idx > -1) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], count: currentCount };
          return updated;
        } else if (currentCount > 0) {
          return [...prev, { id: docId, workoutId, date, count: currentCount }];
        }
        return prev;
      });
    }
  };

  const resetCompletion = async (workoutId: string, date: string) => {
    const existing = completions.find(c => c.workoutId === workoutId && c.date === date);
    if (!existing) return;

    const existingId = existing.id;
    const currentCount = existing.count;
    const docId = existingId;

    // 1. Mise à jour optimiste instantanée (0ms)
    setCompletions(prev => prev.filter(c => !(c.workoutId === workoutId && c.date === date)));

    // 2. Écriture directe Firestore
    try {
      await deleteDoc(doc(db, 'completions', docId));
    } catch (error) {
      console.error('Error resetting completion:', error);
      // Annulation en cas d'erreur
      setCompletions(prev => [...prev, { id: docId, workoutId, date, count: currentCount }]);
    }
  };

  const getCompletionCount = (workoutId: string, date: string): number => {
    const comp = completions.find(c => c.workoutId === workoutId && c.date === date);
    return comp?.count || 0;
  };

  return { incrementCompletion, decrementCompletion, resetCompletion, getCompletionCount };
}
