import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { allTransactions } from '../data/mockData';

// Swipeable Item — Complex Component using PanResponder
const SwipeableItem = ({ item, onDelete }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const deleteOpacity = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) =>
        Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dy) < 20,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(Math.max(gestureState.dx, -90));
          deleteOpacity.setValue(Math.min(Math.abs(gestureState.dx) / 80, 1));
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx < -60) {
          Animated.spring(translateX, { toValue: -80, useNativeDriver: true }).start();
          Animated.timing(deleteOpacity, { toValue: 1, duration: 150, useNativeDriver: true }).start();
        } else {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
          Animated.timing(deleteOpacity, { toValue: 0, duration: 150, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  const handleDelete = () => {
    Alert.alert('Delete', `Delete "${item.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(item.id) },
    ]);
  };

  return (
    <View style={styles.swipeContainer}>
      <Animated.View style={[styles.deleteBackground, { opacity: deleteOpacity }]}>
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteIcon}>🗑</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={[styles.expenseItem, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        <View style={[styles.expenseIconBox, { backgroundColor: item.color }]}>
          <Text style={styles.expenseIcon}>{item.icon}</Text>
        </View>
        <View style={styles.expenseDetails}>
          <Text style={styles.expenseName}>{item.name}</Text>
          <Text style={styles.expenseCategory}>{item.category}</Text>
        </View>
        <View style={styles.expenseRight}>
          <Text style={styles.expenseAmount}>-${item.amount.toFixed(2)}</Text>
          <Text style={styles.expenseTime}>{item.time}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const ExpenseList = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [transactions, setTransactions] = useState(allTransactions);

  const handleDelete = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const grouped = transactions.reduce((acc, t) => {
    if (!acc[t.group]) acc[t.group] = [];
    acc[t.group].push(t);
    return acc;
  }, {});

  const groupTotals = Object.keys(grouped).reduce((acc, group) => {
    acc[group] = grouped[group].reduce((s, t) => s + t.amount, 0);
    return acc;
  }, {});

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction History</Text>
        <TouchableOpacity style={styles.calendarButton}>
          <Text style={styles.calendarIcon}>📅</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.hintBar}>
        <Text style={styles.hintText}>← Swipe left on a transaction to delete</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {Object.keys(grouped).map((group) => (
          <View key={group} style={styles.groupSection}>
            <View style={styles.groupHeader}>
              <Text style={styles.groupTitle}>{group}</Text>
              <Text style={styles.groupTotal}>-${groupTotals[group].toFixed(2)}</Text>
            </View>
            {grouped[group].map((item) => (
              <SwipeableItem key={item.id} item={item} onDelete={handleDelete} />
            ))}
          </View>
        ))}

        {transactions.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No transactions yet</Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Nav */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 8 }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Analytics')}>
          <Text style={styles.navIcon}>📊</Text>
          <Text style={styles.navLabel}>Analytics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddExpense')}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIconActive}>🕐</Text>
          <Text style={styles.navLabelActive}>History</Text>
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
  container: { flex: 1, backgroundColor: '#0A1F0A' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backArrow: { color: '#FFFFFF', fontSize: 28, fontWeight: '400' },
  headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  calendarButton: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#1E4A1E', alignItems: 'center', justifyContent: 'center',
  },
  calendarIcon: { fontSize: 18 },
  hintBar: { paddingHorizontal: 20, paddingBottom: 8 },
  hintText: { color: '#4A7A44', fontSize: 12, fontStyle: 'italic' },
  scrollView: { flex: 1, paddingHorizontal: 20 },
  groupSection: { marginBottom: 24 },
  groupHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  groupTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  groupTotal: { color: '#6AAD6A', fontSize: 14, fontWeight: '600' },
  swipeContainer: {
    marginBottom: 12, overflow: 'hidden',
    borderRadius: 16, position: 'relative',
  },
  deleteBackground: {
    position: 'absolute', right: 0, top: 0, bottom: 0,
    width: 80, backgroundColor: '#EF4444',
    borderRadius: 16, alignItems: 'center', justifyContent: 'center',
  },
  deleteBtn: {
    alignItems: 'center', justifyContent: 'center', width: 80, height: '100%',
  },
  deleteIcon: { fontSize: 22 },
  expenseItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#122012', borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: '#1E3A1E',
  },
  expenseIconBox: {
    width: 48, height: 48, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  expenseIcon: { fontSize: 20 },
  expenseDetails: { flex: 1 },
  expenseName: { color: '#FFFFFF', fontSize: 15, fontWeight: '600', marginBottom: 4 },
  expenseCategory: { color: '#4ADE80', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  expenseRight: { alignItems: 'flex-end' },
  expenseAmount: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', marginBottom: 4 },
  expenseTime: { color: '#6AAD6A', fontSize: 12 },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyText: { color: '#6AAD6A', fontSize: 16 },
  bottomNav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    backgroundColor: '#0D250D', paddingVertical: 12, paddingBottom: 24,
    borderTopWidth: 1, borderTopColor: '#1A3A1A',
    position: 'absolute', bottom: 0, left: 0, right: 0,
  },
  navItem: { alignItems: 'center', flex: 1 },
  navIcon: { fontSize: 20, marginBottom: 4, opacity: 0.5 },
  navIconActive: { fontSize: 20, marginBottom: 4 },
  navLabel: { color: '#6AAD6A', fontSize: 11, opacity: 0.6 },
  navLabelActive: { color: '#4ADE80', fontSize: 11, fontWeight: '600' },
  addButton: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: '#4ADE80',
    alignItems: 'center', justifyContent: 'center', marginTop: -30,
    shadowColor: '#4ADE80', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5, shadowRadius: 12, elevation: 10,
  },
  addButtonText: { color: '#0A1F0A', fontSize: 28, fontWeight: '800', lineHeight: 32 },
});

export default ExpenseList;