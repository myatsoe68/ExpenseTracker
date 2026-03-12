import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';

import Login from './screens/Login';
import Home from './screens/Home';
import AddExpense from './screens/AddExpense';
import EditExpense from './screens/EditExpense';
import ExpenseList from './screens/ExpenseList';
import Analytics from './screens/Analytics';
import Category from './screens/Category';
import Profile from './screens/Profile';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#0A1F0A" translucent={false} />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <>
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="AddExpense" component={AddExpense} />
              <Stack.Screen name="EditExpense" component={EditExpense} />
              <Stack.Screen name="ExpenseList" component={ExpenseList} />
              <Stack.Screen name="Analytics" component={Analytics} />
              <Stack.Screen name="Categories" component={Category} />
              <Stack.Screen name="Profile" component={Profile} />
            </>
          ) : (
            <Stack.Screen name="Login" component={Login} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}