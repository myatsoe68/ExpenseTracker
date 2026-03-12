import {
  doc, setDoc, getDoc, onSnapshot
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Set or update monthly budget
export const setBudget = async (amount) => {
  try {
    const budgetRef = doc(db, 'budgets', auth.currentUser.uid);
    await setDoc(budgetRef, {
      userId: auth.currentUser.uid,
      amount: parseFloat(amount),
      updatedAt: new Date(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get budget once
export const getBudget = async () => {
  try {
    const budgetRef = doc(db, 'budgets', auth.currentUser.uid);
    const snap = await getDoc(budgetRef);
    if (snap.exists()) {
      return snap.data().amount;
    }
    return 500; // default budget
  } catch (error) {
    return 500;
  }
};

// Listen to budget in real-time
export const listenToBudget = (callback) => {
  const budgetRef = doc(db, 'budgets', auth.currentUser.uid);
  return onSnapshot(budgetRef, (snap) => {
    if (snap.exists()) {
      callback(snap.data().amount);
    } else {
      callback(500); // default budget
    }
  });
};