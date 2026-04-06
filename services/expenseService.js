import { 
  collection, addDoc, getDocs, deleteDoc, 
  doc, query, where, orderBy, serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Add a new expense
export const addExpense = async (amount, category, categoryIcon, note) => {
  try {
    const docRef = await addDoc(collection(db, 'expenses'), {
      userId: auth.currentUser.uid,
      amount: parseFloat(amount),
      category,
      categoryIcon,
      note: note || '',
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all expenses for current user (real-time)
export const listenToExpenses = (callback) => {
  const q = query(
    collection(db, 'expenses'),
    where('userId', '==', auth.currentUser.uid),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const expenses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(expenses);
  });
};

// Get recent expenses (limited)
export const listenToRecentExpenses = (callback, limitCount = 5) => {
  const q = query(
    collection(db, 'expenses'),
    where('userId', '==', auth.currentUser.uid),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const expenses = snapshot.docs
      .slice(0, limitCount)
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    callback(expenses);
  });
};

// Delete an expense
export const deleteExpense = async (expenseId) => {
  try {
    console.log('Deleting:', expenseId);
    console.log('User:', auth.currentUser?.uid);
    await deleteDoc(doc(db, 'expenses', expenseId));
    console.log('Deleted successfully!');
    return { success: true };
  } catch (error) {
    console.log('Error:', error.code, error.message);
    return { success: false, error: error.message };
  }
};

// Get all expenses once (not real-time)
export const getExpenses = async () => {
  try {
    const q = query(
      collection(db, 'expenses'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    return [];
  }
};

// Get active categories for current user
export const listenToActiveCategories = (callback) => {
  const userId = auth.currentUser.uid;
  const ref = collection(db, 'users', userId, 'categories');
  return onSnapshot(ref, (snapshot) => {
    const data = snapshot.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((c) => c.active === true);
    callback(data);
  });
};