import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { categories as initialCategories } from '../data/mockData';

const CategoryItem = ({ item, onToggle }) => (
  <View style={[styles.categoryItem, !item.active && styles.categoryItemInactive]}>
    <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
      <Text style={styles.categoryIconText}>{item.icon}</Text>
    </View>
    <View style={styles.categoryInfo}>
      <Text style={[styles.categoryName, !item.active && styles.textInactive]}>
        {item.name}
      </Text>
      <Text style={[styles.categorySubtitle, !item.active && styles.textInactive]}>
        {item.subtitle}
      </Text>
    </View>
    <Switch
      value={item.active}
      onValueChange={() => onToggle(item.id)}
      trackColor={{ false: '#1E3A1E', true: '#4ADE80' }}
      thumbColor="#FFFFFF"
      ios_backgroundColor="#1E3A1E"
    />
  </View>
);

const Category = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [categories, setCategories] = useState(initialCategories);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleCategory = (id) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, active: !cat.active } : cat))
    );
  };

  const handleAddCategory = () => {
    Alert.alert('Add Category', 'This would open a form to create a new custom category.', [
      { text: 'OK' },
    ]);
  };

  const filtered = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCategories = filtered.filter((c) => c.active);
  const inactiveCategories = filtered.filter((c) => !c.active);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Categories</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search categories"
          placeholderTextColor="#4A7A44"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {activeCategories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Categories</Text>
            {activeCategories.map((cat) => (
              <CategoryItem key={cat.id} item={cat} onToggle={toggleCategory} />
            ))}
          </View>
        )}

        {inactiveCategories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Inactive Categories</Text>
            {inactiveCategories.map((cat) => (
              <CategoryItem key={cat.id} item={cat} onToggle={toggleCategory} />
            ))}
          </View>
        )}

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No categories found</Text>
          </View>
        )}

        {/* Tip Card */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>ℹ️</Text>
          <Text style={styles.tipText}>
            Tap the '+' icon at the top to create your own custom spending category.
          </Text>
        </View>

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
        <TouchableOpacity style={styles.fabButton} onPress={() => navigation.navigate('AddExpense')}>
          <Text style={styles.fabButtonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ExpenseList')}>
          <Text style={styles.navIcon}>🕐</Text>
          <Text style={styles.navLabel}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIconActive}>⊞</Text>
          <Text style={styles.navLabelActive}>Categories</Text>
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
  addButton: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#1E4A1E', alignItems: 'center',
    justifyContent: 'center', borderWidth: 1, borderColor: '#4ADE80',
  },
  addButtonText: { color: '#4ADE80', fontSize: 22, fontWeight: '700', lineHeight: 26 },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#122012', borderRadius: 14,
    marginHorizontal: 20, marginBottom: 20,
    paddingHorizontal: 14, height: 50,
    borderWidth: 1, borderColor: '#1E3A1E',
  },
  searchIcon: { fontSize: 16, marginRight: 10 },
  searchInput: { flex: 1, color: '#FFFFFF', fontSize: 15 },
  scrollView: { flex: 1, paddingHorizontal: 20 },
  section: { marginBottom: 24 },
  sectionTitle: {
    color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginBottom: 14,
  },
  categoryItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#122012', borderRadius: 16,
    padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: '#1E3A1E',
  },
  categoryItemInactive: { opacity: 0.6 },
  categoryIcon: {
    width: 48, height: 48, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  categoryIconText: { fontSize: 22 },
  categoryInfo: { flex: 1 },
  categoryName: { color: '#FFFFFF', fontSize: 15, fontWeight: '600', marginBottom: 3 },
  categorySubtitle: { color: '#6AAD6A', fontSize: 12 },
  textInactive: { color: '#4A6A4A' },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyIcon: { fontSize: 36, marginBottom: 12 },
  emptyText: { color: '#6AAD6A', fontSize: 15 },
  tipCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: '#0D2D0D', borderRadius: 16,
    padding: 16, borderWidth: 1, borderColor: '#2A5A2A', marginBottom: 16,
  },
  tipIcon: { fontSize: 18, marginRight: 12, marginTop: 1 },
  tipText: { flex: 1, color: '#6AAD6A', fontSize: 14, lineHeight: 20 },
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
  fabButton: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: '#4ADE80',
    alignItems: 'center', justifyContent: 'center', marginTop: -30,
    shadowColor: '#4ADE80', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5, shadowRadius: 12, elevation: 10,
  },
  fabButtonText: { color: '#0A1F0A', fontSize: 28, fontWeight: '800', lineHeight: 32 },
});

export default Category;