import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getAnalyticsSummary } from '../services/analyticsService';

const COLORS = ['#4ADE80', '#22D3EE', '#F59E0B', '#F87171', '#A78BFA', '#FB923C'];

const Analytics = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [summary, setSummary] = useState({ totalSpent: 0, byCategory: [], byMonth: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getAnalyticsSummary();
      setSummary(data);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <ActivityIndicator color="#4ADE80" size="large" style={{ marginTop: 60 }} />
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

          {/* Total Spent Card */}
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>TOTAL SPENT</Text>
            <Text style={styles.totalAmount}>${summary.totalSpent.toFixed(2)}</Text>
            <Text style={styles.totalSub}>
              Across {summary.byCategory.length} categories
            </Text>
          </View>

          {/* Spending by Category */}
          <Text style={styles.sectionTitle}>Spending by Category</Text>

          {summary.byCategory.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📊</Text>
              <Text style={styles.emptyText}>No expenses yet</Text>
            </View>
          ) : (
            summary.byCategory.map((cat, index) => {
              const percentage = summary.totalSpent > 0
                ? (cat.total / summary.totalSpent) * 100
                : 0;
              const color = COLORS[index % COLORS.length];
              return (
                <View key={cat.category} style={styles.categoryRow}>
                  <View style={styles.categoryLeft}>
                    <View style={[styles.categoryDot, { backgroundColor: color }]} />
                    <Text style={styles.categoryIcon}>{cat.categoryIcon}</Text>
                    <View>
                      <Text style={styles.categoryName}>{cat.category}</Text>
                      <Text style={styles.categoryCount}>{cat.count} transactions</Text>
                    </View>
                  </View>
                  <View style={styles.categoryRight}>
                    <Text style={styles.categoryAmount}>${cat.total.toFixed(2)}</Text>
                    <Text style={styles.categoryPercent}>{percentage.toFixed(1)}%</Text>
                  </View>
                </View>
              );
            })
          )}

          {/* Progress Bars */}
          {summary.byCategory.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Breakdown</Text>
              {summary.byCategory.map((cat, index) => {
                const percentage = summary.totalSpent > 0
                  ? (cat.total / summary.totalSpent) * 100
                  : 0;
                const color = COLORS[index % COLORS.length];
                return (
                  <View key={cat.category} style={styles.progressRow}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.progressLabel}>
                        {cat.categoryIcon} {cat.category}
                      </Text>
                      <Text style={styles.progressValue}>{percentage.toFixed(1)}%</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View
                        style={[
                          styles.progressBarFill,
                          { width: `${percentage}%`, backgroundColor: color },
                        ]}
                      />
                    </View>
                  </View>
                );
              })}
            </>
          )}

          {/* Monthly Breakdown */}
          {summary.byMonth.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Monthly Spending</Text>
              {summary.byMonth.map((month) => (
                <View key={month.key} style={styles.monthRow}>
                  <Text style={styles.monthLabel}>{month.label}</Text>
                  <Text style={styles.monthAmount}>${month.total.toFixed(2)}</Text>
                </View>
              ))}
            </>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      )}

      {/* Bottom Nav */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 8 }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIconActive}>📊</Text>
          <Text style={styles.navLabelActive}>Analytics</Text>
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
  container: { flex: 1, backgroundColor: '#0A1F0A' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8,
  },
  backArrow: { color: '#FFFFFF', fontSize: 28, fontWeight: '400' },
  headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  scrollView: { flex: 1, paddingHorizontal: 20 },
  totalCard: {
    backgroundColor: '#122012', borderRadius: 20,
    padding: 24, marginBottom: 28,
    borderWidth: 1, borderColor: '#1E3A1E',
    alignItems: 'center',
  },
  totalLabel: { color: '#4ADE80', fontSize: 12, fontWeight: '700', letterSpacing: 1.5, marginBottom: 8 },
  totalAmount: { color: '#4ADE80', fontSize: 48, fontWeight: '800', marginBottom: 4 },
  totalSub: { color: '#6AAD6A', fontSize: 13 },
  sectionTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginBottom: 16 },
  categoryRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#122012', borderRadius: 14,
    padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: '#1E3A1E',
  },
  categoryLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  categoryDot: { width: 10, height: 10, borderRadius: 5 },
  categoryIcon: { fontSize: 20 },
  categoryName: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  categoryCount: { color: '#6AAD6A', fontSize: 11, marginTop: 2 },
  categoryRight: { alignItems: 'flex-end' },
  categoryAmount: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  categoryPercent: { color: '#4ADE80', fontSize: 12, fontWeight: '600', marginTop: 2 },
  progressRow: { marginBottom: 14 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  progressValue: { color: '#4ADE80', fontSize: 13, fontWeight: '700' },
  progressBarBg: { height: 8, backgroundColor: '#1E3A1E', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  monthRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: '#122012', borderRadius: 12,
    padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: '#1E3A1E',
  },
  monthLabel: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  monthAmount: { color: '#4ADE80', fontSize: 14, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: '#6AAD6A', fontSize: 15 },
  bottomNav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    backgroundColor: '#0D250D', paddingVertical: 12,
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

export default Analytics;