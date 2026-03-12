# 💸 Expense Tracker

A mobile expense tracking app built with React Native, Expo, and Firebase.

## Features

- 🔐 Authentication — Register and login with email & password
- 🏠 Home — Budget overview with real-time remaining balance
- ➕ Add Expense — Custom numpad with category selector
- ✏️ Edit Expense — Modify amount, category, and notes
- 🕐 Transaction History — Swipe-to-delete, grouped by date
- 📊 Analytics — Spending breakdown by category and month
- 🗂 Categories — Add, toggle, and delete categories
- 👤 Profile — Set monthly budget, display name, and password

## Tech Stack

- React Native (Expo)
- React Navigation
- Firebase Authentication
- Firebase Firestore
- Firebase Hosting

## Getting Started

```bash
npx create-expo-app ExpenseTracker --template blank
cd ExpenseTracker
npm install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context
npx expo install firebase
npx expo install @react-native-async-storage/async-storage
npx expo start
```

## Folder Structure

```
ExpenseTracker/
├── App.js
├── config/
│   └── firebase.js
├── screens/
│   ├── Login.js
│   ├── Home.js
│   ├── AddExpense.js
│   ├── EditExpense.js
│   ├── ExpenseList.js
│   ├── Analytics.js
│   ├── Category.js
│   └── Profile.js
├── services/
│   ├── expenseService.js
│   ├── budgetService.js
│   └── analyticsService.js
└── data/
    └── mockData.js
```

## Environment Setup

Create `config/firebase.js` with your Firebase project credentials:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Running the App

Scan the QR code in terminal with **Expo Go** (Android/iOS).

## Live Demo

https://expensetracker-35b03.web.app
