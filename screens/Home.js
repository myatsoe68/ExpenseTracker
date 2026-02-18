import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { currentUser, budgetData, recentExpenses } from '../data/mockData';

const ExpenseItem = ({ item }) => (
  <View style={styles.expenseItem}>
    <View style={styles.expenseIconContainer}>
      <Text style={styles.expenseIcon}>{item.icon}</Text>
    </View>
    <View style={styles.expenseDetails}>
      <Text style={styles.expenseName}>{item.name}</Text>
      <Text style={styles.expenseDate}>{item.date}, {item.time}</Text>
    </View>
    <Text style={styles.expenseAmount}>-${item.amount.toFixed(2)}</Text>
  </View>
);

const Home = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const spent = budgetData.totalBudget - budgetData.remaining;
  const progress = spent / budgetData.totalBudget;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* Top Bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.welcomeText}>Welcome back, {currentUser.name}</Text>
            <Text style={styles.welcomeSubtext}>Your finances are looking healthy</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Text style={styles.bellIcon}>🔔</Text>
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Budget Card */}
        <View style={styles.budgetCard}>
          <View style={styles.budgetCardInner}>
            <View>
              <Text style={styles.budgetLabel}>{budgetData.month.toUpperCase()} BUDGET</Text>
              <Text style={styles.budgetAmount}>${budgetData.remaining.toFixed(2)}</Text>
              <Text style={styles.budgetSubtext}>Remaining Balance</Text>
            </View>
            <View style={styles.walletIconContainer}>
              <Text style={styles.walletIcon}>💳</Text>
            </View>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${(1 - progress) * 100}%` }]} />
          </View>
        </View>

        {/* Recent Expenses */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Expenses</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ExpenseList')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {recentExpenses.map((item) => (
          <ExpenseItem key={item.id} item={item} />
        ))}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 8 }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.navIconActive}>🏠</Text>
          <Text style={styles.navLabelActive}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Analytics')}>
          <Text style={styles.navIcon}>📊</Text>
          <Text style={styles.navLabel}>Analytics</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddExpense')}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ExpenseList')}>
          <Text style={styles.navIcon}>🕐</Text>
          <Text style={styles.navLabel}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Categories')}>
          <Text style={styles.navIcon}>⊞</Text>
          <Text style={styles.navLabel}>Categories</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1F0A',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    marginBottom: 24,
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  welcomeSubtext: {
    color: '#6AAD6A',
    fontSize: 13,
    marginTop: 2,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1A3A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellIcon: {
    fontSize: 18,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4ADE80',
    borderWidth: 2,
    borderColor: '#0A1F0A',
  },
  budgetCard: {
    backgroundColor: '#122012',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#1E3A1E',
  },
  budgetCardInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  budgetLabel: {
    color: '#4ADE80',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  budgetAmount: {
    color: '#4ADE80',
    fontSize: 40,
    fontWeight: '800',
    marginBottom: 4,
  },
  budgetSubtext: {
    color: '#6AAD6A',
    fontSize: 14,
  },
  walletIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#1E4A1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletIcon: {
    fontSize: 24,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#1E3A1E',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4ADE80',
    borderRadius: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  seeAllText: {
    color: '#4ADE80',
    fontSize: 14,
    fontWeight: '600',
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#122012',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1E3A1E',
  },
  expenseIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1A3A1A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  expenseIcon: {
    fontSize: 20,
  },
  expenseDetails: {
    flex: 1,
  },
  expenseName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  expenseDate: {
    color: '#6AAD6A',
    fontSize: 12,
  },
  expenseAmount: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  bottomPadding: {
    height: 100,
  },
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#0D250D',
    paddingVertical: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#1A3A1A',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
    opacity: 0.5,
  },
  navIconActive: {
    fontSize: 20,
    marginBottom: 4,
  },
  navLabel: {
    color: '#6AAD6A',
    fontSize: 11,
    opacity: 0.6,
  },
  navLabelActive: {
    color: '#4ADE80',
    fontSize: 11,
    fontWeight: '600',
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4ADE80',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -30,
    shadowColor: '#4ADE80',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  addButtonText: {
    color: '#0A1F0A',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 32,
  },
});

export default Home;