import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Switch, Alert, TextInput, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  collection, doc, setDoc, onSnapshot, deleteDoc
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const DEFAULT_CATEGORIES = [
  { id: '1', label: 'Food', icon: '🍴', active: true },
  { id: '2', label: 'Transport', icon: '🚌', active: true },
  { id: '3', label: 'Shopping', icon: '🛍', active: true },
  { id: '4', label: 'Education', icon: '📚', active: true },
  { id: '5', label: 'Health', icon: '💊', active: false },
  { id: '6', label: 'Travel', icon: '✈️', active: false },
  { id: '7', label: 'Subscriptions', icon: '📱', active: false },
  { id: '8', label: 'Other', icon: '💡', active: true },
];

const Category = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [newLabel, setNewLabel] = useState('');
  const [newIcon, setNewIcon] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Load categories from Firestore
  useEffect(() => {
    const userId = auth.currentUser.uid;
    const ref = collection(db, 'users', userId, 'categories');

    const unsubscribe = onSnapshot(ref, async (snapshot) => {
      if (snapshot.empty) {
        // First time — save default categories
        for (const cat of DEFAULT_CATEGORIES) {
          await setDoc(doc(db, 'users', userId, 'categories', cat.id), cat);
        }
      } else {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setCategories(data);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // Toggle category active/inactive
  const toggleCategory = async (cat) => {
    const userId = auth.currentUser.uid;
    await setDoc(
      doc(db, 'users', userId, 'categories', cat.id),
      { ...cat, active: !cat.active }
    );
  };

  // Add new category
  const handleAddCategory = async () => {
    if (!newLabel.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }
    const userId = auth.currentUser.uid;
    const id = Date.now().toString();
    await setDoc(doc(db, 'users', userId, 'categories', id), {
      id,
      label: newLabel.trim(),
      icon: newIcon.trim() || '💡',
      active: true,
    });
    setNewLabel('');
    setNewIcon('');
    setShowAddForm(false);
  };

  // Delete category
  const handleDelete = (cat) => {
    Alert.alert('Delete', `Delete "${cat.label}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          const userId = auth.currentUser.uid;
          await deleteDoc(doc(db, 'users', userId, 'categories', cat.id));
        }
      },
    ]);
  };

  const filtered = categories.filter((c) =>
    c.label.toLowerCase().includes(search.toLowerCase())
  );
  const active = filtered.filter((c) => c.active);
  const inactive = filtered.filter((c) => !c.active);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Categories</Text>
        <TouchableOpacity onPress={() => setShowAddForm(!showAddForm)}>
          <Text style={styles.addIcon}>＋</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search categories..."
          placeholderTextColor="#4A7A44"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Add Form */}
      {showAddForm && (
        <View style={styles.addForm}>
          <TextInput
            style={styles.addInput}
            placeholder="Category name (e.g. Gym)"
            placeholderTextColor="#4A7A44"
            value={newLabel}
            onChangeText={setNewLabel}
          />
          <TextInput
            style={styles.addInput}
            placeholder="Icon emoji (e.g. 🏋️)"
            placeholderTextColor="#4A7A44"
            value={newIcon}
            onChangeText={setNewIcon}
          />
          <TouchableOpacity style={styles.addFormButton} onPress={handleAddCategory}>
            <Text style={styles.addFormButtonText}>Add Category</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <ActivityIndicator color="#4ADE80" size="large" style={{ marginTop: 60 }} />
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

          {/* Active Categories */}
          <Text style={styles.sectionTitle}>Active ({active.length})</Text>
          {active.map((cat) => (
            <View key={cat.id} style={styles.categoryRow}>
              <View style={styles.categoryLeft}>
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text style={styles.categoryLabel}>{cat.label}</Text>
              </View>
              <View style={styles.categoryRight}>
                <TouchableOpacity onPress={() => handleDelete(cat)} style={styles.deleteBtn}>
                  <Text style={styles.deleteText}>🗑</Text>
                </TouchableOpacity>
                <Switch
                  value={cat.active}
                  onValueChange={() => toggleCategory(cat)}
                  trackColor={{ false: '#1E3A1E', true: '#4ADE80' }}
                  thumbColor={cat.active ? '#FFFFFF' : '#6AAD6A'}
                />
              </View>
            </View>
          ))}

          {/* Inactive Categories */}
          {inactive.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
                Inactive ({inactive.length})
              </Text>
              {inactive.map((cat) => (
                <View key={cat.id} style={[styles.categoryRow, styles.categoryRowInactive]}>
                  <View style={styles.categoryLeft}>
                    <Text style={[styles.categoryIcon, { opacity: 0.4 }]}>{cat.icon}</Text>
                    <Text style={[styles.categoryLabel, { opacity: 0.4 }]}>{cat.label}</Text>
                  </View>
                  <View style={styles.categoryRight}>
                    <TouchableOpacity onPress={() => handleDelete(cat)} style={styles.deleteBtn}>
                      <Text style={styles.deleteText}>🗑</Text>
                    </TouchableOpacity>
                    <Switch
                      value={cat.active}
                      onValueChange={() => toggleCategory(cat)}
                      trackColor={{ false: '#1E3A1E', true: '#4ADE80' }}
                      thumbColor={cat.active ? '#FFFFFF' : '#6AAD6A'}
                    />
                  </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8,
  },
  backArrow: { color: '#FFFFFF', fontSize: 28 },
  headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  addIcon: { color: '#4ADE80', fontSize: 24, fontWeight: '700' },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#122012', borderRadius: 14,
    marginHorizontal: 20, marginBottom: 16,
    paddingHorizontal: 14, height: 48,
    borderWidth: 1, borderColor: '#1E3A1E',
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, color: '#FFFFFF', fontSize: 14 },
  addForm: {
    marginHorizontal: 20, marginBottom: 16,
    backgroundColor: '#122012', borderRadius: 14,
    padding: 16, borderWidth: 1, borderColor: '#1E3A1E',
  },
  addInput: {
    backgroundColor: '#1A3A1A', borderRadius: 10,
    paddingHorizontal: 14, height: 44,
    color: '#FFFFFF', fontSize: 14, marginBottom: 10,
  },
  addFormButton: {
    backgroundColor: '#4ADE80', borderRadius: 10,
    height: 44, alignItems: 'center', justifyContent: 'center',
  },
  addFormButtonText: { color: '#0A1F0A', fontSize: 15, fontWeight: '700' },
  scrollView: { flex: 1, paddingHorizontal: 20 },
  sectionTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  categoryRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#122012', borderRadius: 14,
    padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: '#1E3A1E',
  },
  categoryRowInactive: { borderColor: '#1A2A1A' },
  categoryLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  categoryIcon: { fontSize: 22 },
  categoryLabel: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  categoryRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  deleteBtn: { padding: 4 },
  deleteText: { fontSize: 16 },
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

export default Category;