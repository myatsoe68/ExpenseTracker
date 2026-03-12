import {
  collection, query, where, getDocs
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Get total spent
export const getTotalSpent = async () => {
  try {
    const q = query(
      collection(db, 'expenses'),
      where('userId', '==', auth.currentUser.uid)
    );
    const snapshot = await getDocs(q);
    const total = snapshot.docs.reduce(
      (sum, doc) => sum + doc.data().amount, 0
    );
    return total;
  } catch (error) {
    return 0;
  }
};

// Get spending by category
export const getSpendingByCategory = async () => {
  try {
    const q = query(
      collection(db, 'expenses'),
      where('userId', '==', auth.currentUser.uid)
    );
    const snapshot = await getDocs(q);
    const categoryMap = {};

    snapshot.docs.forEach((doc) => {
      const { category, categoryIcon, amount } = doc.data();
      if (!categoryMap[category]) {
        categoryMap[category] = { 
          category, 
          categoryIcon, 
          total: 0, 
          count: 0 
        };
      }
      categoryMap[category].total += amount;
      categoryMap[category].count += 1;
    });

    return Object.values(categoryMap).sort((a, b) => b.total - a.total);
  } catch (error) {
    return [];
  }
};

// Get spending by month
export const getSpendingByMonth = async () => {
  try {
    const q = query(
      collection(db, 'expenses'),
      where('userId', '==', auth.currentUser.uid)
    );
    const snapshot = await getDocs(q);
    const monthMap = {};

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (data.createdAt) {
        const date = data.createdAt.toDate();
        const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
        const label = date.toLocaleString('default', { 
          month: 'short', 
          year: 'numeric' 
        });
        if (!monthMap[key]) {
          monthMap[key] = { key, label, total: 0 };
        }
        monthMap[key].total += data.amount;
      }
    });

    return Object.values(monthMap).sort((a, b) => 
      a.key.localeCompare(b.key)
    );
  } catch (error) {
    return [];
  }
};

// Get full analytics summary
export const getAnalyticsSummary = async () => {
  try {
    const [totalSpent, byCategory, byMonth] = await Promise.all([
      getTotalSpent(),
      getSpendingByCategory(),
      getSpendingByMonth(),
    ]);
    return { totalSpent, byCategory, byMonth };
  } catch (error) {
    return { totalSpent: 0, byCategory: [], byMonth: [] };
  }
};