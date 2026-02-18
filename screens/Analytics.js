import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { analyticsData } from '../data/mockData';

const { width } = Dimensions.get('window');
const RING_SIZE = width * 0.62;
const RING_BORDER = 38;

// Donut chart built purely with React Native Views (no external library)
const DonutChart = ({ categories, total, month }) => {
  return (
    <View style={styles.donutWrapper}>
      <View style={[styles.ringOuter, { width: RING_SIZE, height: RING_SIZE, borderRadius: RING_SIZE / 2 }]}>
        {categories.map((cat, i) => {
          const startPct = categories.slice(0, i).reduce((s, c) => s + c.percentage, 0);
          const startDeg = (startPct / 100) * 360 - 90;
          return (
            <View
              key={cat.name}
              style={{
                position: 'absolute',
                width: RING_SIZE,
                height: RING_SIZE,
                borderRadius: RING_SIZE / 2,
                borderWidth: RING_BORDER,
                borderTopColor: cat.color,
                borderRightColor: cat.percentage > 25 ? cat.color : 'transparent',
                borderBottomColor: cat.percentage > 50 ? cat.color : 'transparent',
                borderLeftColor: cat.percentage > 75 ? cat.color : 'transparent',
                transform: [{ rotate: `${startDeg}deg` }],
                zIndex: categories.length - i,
              }}
            />
          );
        })}
        {/* Inner white circle to create donut hole */}
        <View
          style={[
            styles.ringInner,
            {
              width: RING_SIZE - RING_BORDER * 2 - 8,
              height: RING_SIZE - RING_BORDER * 2 - 8,
              borderRadius: (RING_SIZE - RING_BORDER * 2 - 8) / 2,
            },
          ]}
        >
          <Text style={styles.donutLabel}>TOTAL</Text>
          <Text style={styles.donutAmount}>${total.toLocaleString()}</Text>
          <Text style={styles.donutMonth}>{month}</Text>
        </View>
      </View>

      {/* Color Legend */}
      <View style={styles.legendRow}>
        {categories.map((cat) => (
          <View key={cat.name} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: cat.color }]} />
          </View>
        ))}
      </View>
    </View>
  );
};

const CategoryRow = ({ item, isSelected, onPress }) => (
  <TouchableOpacity
    style={[styles.categoryRow, isSelected && styles.categoryRowSelected]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={[styles.categoryIcon, { backgroundColor: item.color + '33' }]}>
      <Text style={styles.categoryIconText}>{item.icon}</Text>
    </View>
    <Text style={styles.categoryName}>{item.name}</Text>
    <Text style={styles.categoryAmount}>${item.amount.toFixed(2)}</Text>
  </TouchableOpacity>
);

const Analytics = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState(null);
  const { categories, total, month } = analyticsData;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Spending Analysis</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.chartSection}>
          <DonutChart categories={categories} total={total} month={month} />
        </View>

        <View style={styles.breakdownSection}>
          <Text style={styles.breakdownTitle}>Category Breakdown</Text>
          {categories.map((cat, idx) => (
            <CategoryRow
              key={cat.name}
              item={cat}
              isSelected={selected === idx}
              onPress={() => setSelected(idx === selected ? null : idx)}
            />
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

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
    justifyContent: 'space-between', paddingHorizontal: 20,
    paddingTop: 16, paddingBottom: 8,
  },
  backArrow: { color: '#FFFFFF', fontSize: 28, fontWeight: '400' },
  headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  chartSection: { alignItems: 'center', paddingVertical: 24 },
  donutWrapper: { alignItems: 'center' },
  ringOuter: {
    position: 'relative', alignItems: 'center', justifyContent: 'center',
  },
  ringInner: {
    backgroundColor: '#0A1F0A', alignItems: 'center',
    justifyContent: 'center', zIndex: 100,
  },
  donutLabel: {
    color: '#4ADE80', fontSize: 11, fontWeight: '700',
    letterSpacing: 2, marginBottom: 4,
  },
  donutAmount: { color: '#FFFFFF', fontSize: 26, fontWeight: '800' },
  donutMonth: { color: '#6AAD6A', fontSize: 11, marginTop: 4 },
  legendRow: { flexDirection: 'row', marginTop: 16, gap: 10 },
  legendItem: { alignItems: 'center' },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  breakdownSection: { paddingHorizontal: 20 },
  breakdownTitle: {
    color: '#FFFFFF', fontSize: 20, fontWeight: '700', marginBottom: 16,
  },
  categoryRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#122012', borderRadius: 16,
    padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: '#1E3A1E',
  },
  categoryRowSelected: { borderColor: '#4ADE80' },
  categoryIcon: {
    width: 48, height: 48, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  categoryIconText: { fontSize: 22 },
  categoryName: { flex: 1, color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  categoryAmount: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
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

export default Analytics;