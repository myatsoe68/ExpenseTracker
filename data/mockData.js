export const currentUser = {
  name: 'Myat',
  email: 'myat@example.com',
  password: 'password123',
};

export const budgetData = {
  month: 'August',
  totalBudget: 500,
  remaining: 380,
};

export const recentExpenses = [
  {
    id: '1',
    name: 'Starbucks Coffee',
    category: 'Food & Drinks',
    amount: 5.5,
    date: 'Today',
    time: '8:45 AM',
    icon: '☕',
  },
  {
    id: '2',
    name: 'Campus Bookstore',
    category: 'Books & Study',
    amount: 45,
    date: 'Yesterday',
    time: '2:15 PM',
    icon: '📚',
  },
  {
    id: '3',
    name: 'Bus Pass Monthly',
    category: 'Transport',
    amount: 60,
    date: 'Aug 1',
    time: '10:00 AM',
    icon: '🚌',
  },
];

export const allTransactions = [
  {
    id: '1',
    name: 'Campus Cafe',
    category: 'FOOD & DRINKS',
    amount: 5.5,
    time: '10:24 AM',
    group: 'Today',
    icon: '☕',
    color: '#2D7A20',
  },
  {
    id: '2',
    name: 'Textbook Store',
    category: 'STUDY SUPPLIES',
    amount: 32,
    time: '09:15 AM',
    group: 'Today',
    icon: '📚',
    color: '#1A4A2E',
  },
  {
    id: '3',
    name: 'Metro Pass',
    category: 'TRANSPORT',
    amount: 4.5,
    time: '08:30 AM',
    group: 'Today',
    icon: '🚌',
    color: '#7A4A10',
  },
  {
    id: '4',
    name: 'Target Pharmacy',
    category: 'PERSONAL CARE',
    amount: 12.75,
    time: '06:45 PM',
    group: 'Yesterday',
    icon: '🛍',
    color: '#5A2080',
  },
  {
    id: '5',
    name: 'Late Night Tacos',
    category: 'FOOD & DRINKS',
    amount: 5.5,
    time: '11:15 PM',
    group: 'Yesterday',
    icon: '🌮',
    color: '#2D7A20',
  },
];

export const analyticsData = {
  total: 1240,
  month: 'October 2023',
  categories: [
    { name: 'Food & Drinks', amount: 409.2, color: '#4ADE80', icon: '🍴', percentage: 33 },
    { name: 'Rent & Housing', amount: 310, color: '#3B82F6', icon: '🏠', percentage: 25 },
    { name: 'Transport', amount: 248, color: '#F59E0B', icon: '🚌', percentage: 20 },
    { name: 'Books & Study', amount: 186, color: '#A855F7', icon: '📚', percentage: 15 },
    { name: 'Entertainment & Others', amount: 86.8, color: '#6B7280', icon: '🎮', percentage: 7 },
  ],
};

export const categories = [
  {
    id: '1',
    name: 'Food & Drinks',
    subtitle: 'Meals, snacks, coffee',
    icon: '🍴',
    color: '#7A4A10',
    active: true,
  },
  {
    id: '2',
    name: 'Tuition & Fees',
    subtitle: 'University expenses',
    icon: '🎓',
    color: '#1A4A7A',
    active: true,
  },
  {
    id: '3',
    name: 'Books & Supplies',
    subtitle: 'Textbooks, stationery',
    icon: '📚',
    color: '#1A5A2E',
    active: true,
  },
  {
    id: '4',
    name: 'Transportation',
    subtitle: 'Bus, train, bike share',
    icon: '🚌',
    color: '#7A5A10',
    active: true,
  },
  {
    id: '5',
    name: 'Travel & Vacations',
    subtitle: 'Spring break, flights',
    icon: '✈️',
    color: '#4A2A7A',
    active: false,
  },
  {
    id: '6',
    name: 'Subscriptions',
    subtitle: 'Netflix, Spotify, Gym',
    icon: '▶️',
    color: '#7A2A2A',
    active: false,
  },
];