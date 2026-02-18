import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Home from './screens/Home';
import AddExpense from './screens/AddExpense';
import ExpenseList from './screens/ExpenseList';
import Analytics from './screens/Analytics';
import Category from './screens/Category';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#0A1F0A" translucent={false} />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="AddExpense" component={AddExpense} />
          <Stack.Screen name="ExpenseList" component={ExpenseList} />
          <Stack.Screen name="Analytics" component={Analytics} />
          <Stack.Screen name="Categories" component={Category} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}