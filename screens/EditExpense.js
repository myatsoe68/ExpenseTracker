import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  TextInput, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { listenToActiveCategories } from '../services/expenseService';

const NUMPAD_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'];

const EditExpense = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { expense } = route.params;

  const [amount, setAmount] = useState(expense.amount.toString());
  const [note, setNote] = useState(expense.note || '');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const unsubscribe = listenToActiveCategories((data) => {
      setCategories(data);
      // Set selected to match current expense category
      const match = data.find((c) => c.label === expense.category);
      if (match) setSelectedCategory(match.id);
      else if (data.length > 0) setSelectedCategory(data[0].id);
    });
    return unsubscribe;
  }, []);

  const handleNumpad = (key) => {
    if (key === '⌫') {
      setAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
    } else if (key === '.') {
      if (!amount.includes('.')) setAmount((prev) => prev + '.');
    } else {
      if (amount === '0') {
        setAmount(key);
      } else {
        if (amount.includes('.')) {
          const decimals = amount.split('.')[1];
          if (decimals && decimals.length >= 2) return;
        }
        setAmount((prev) => prev + key);
      }
    }
  };

  const handleSave = async () => {
    if (!amount || parseFloat(amount) === 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    setLoading(true);
    try {
      const category = categories.find((c) => c.id === selectedCategory);
      await updateDoc(doc(db, 'expenses', expense.id), {
        amount: parseFloat(amount),
        category: category?.label || 'Other',
        categoryIcon: category?.icon || '💡',
        note: note,
      });
      Alert.alert('Success', 'Expense updated!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerClose}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Expense</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.headerCheck}>✓</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>AMOUNT</Text>
          <View style={styles.amountRow}>
            <Text style={styles.currencySymbol}>$</Text>
            <Text style={styles.amountValue}>{amount}</Text>
          </View>
        </View>

        <View style={styles.categorySection}>
          <Text style={styles.sectionLabel}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryChip, selectedCategory === cat.id && styles.categoryChipActive]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Text style={styles.categoryChipIcon}>{cat.icon}</Text>
                <Text style={[styles.categoryChipText, selectedCategory === cat.id && styles.categoryChipTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.noteContainer}>
          <TextInput
            style={styles.noteInput}
            placeholder="Add a note"
            placeholderTextColor="#4A7A44"
            value={note}
            onChangeText={setNote}
          />
        </View>

        <View style={styles.numpad}>
          {NUMPAD_KEYS.map((key, index) => (
            <TouchableOpacity
              key={index}
              style={styles.numpadKey}
              onPress={() => handleNumpad(key)}
              activeOpacity={0.7}
            >
              <Text style={styles.numpadKeyText}>{key}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#0A1F0A" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes ✓</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
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
  headerClose: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  headerCheck: { color: '#4ADE80', fontSize: 22, fontWeight: '700' },
  scrollView: { flex: 1, paddingHorizontal: 20, maxWidth: 480, alignSelf: 'center', width: '100%' },
  amountSection: { alignItems: 'center', paddingVertical: 24 },
  amountLabel: { color: '#4ADE80', fontSize: 12, fontWeight: '700', letterSpacing: 2, marginBottom: 12 },
  amountRow: { flexDirection: 'row', alignItems: 'flex-start' },
  currencySymbol: { color: '#FFFFFF', fontSize: 28, fontWeight: '700', marginTop: 10, marginRight: 4 },
  amountValue: { color: '#FFFFFF', fontSize: 68, fontWeight: '800', letterSpacing: -2 },
  categorySection: { marginBottom: 16 },
  sectionLabel: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  categoryScroll: { paddingRight: 20 },
  categoryChip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#122012', borderRadius: 24,
    paddingHorizontal: 16, paddingVertical: 10,
    borderWidth: 1, borderColor: '#1E3A1E', marginRight: 10,
  },
  categoryChipActive: { backgroundColor: '#4ADE80', borderColor: '#4ADE80' },
  categoryChipIcon: { fontSize: 16, marginRight: 6 },
  categoryChipText: { color: '#6AAD6A', fontSize: 14, fontWeight: '600' },
  categoryChipTextActive: { color: '#0A1F0A' },
  noteContainer: {
    backgroundColor: '#122012', borderRadius: 14,
    borderWidth: 1, borderColor: '#1E3A1E',
    paddingHorizontal: 16, height: 52,
    justifyContent: 'center', marginBottom: 20,
  },
  noteInput: { color: '#FFFFFF', fontSize: 14 },
  numpad: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 8, marginBottom: 20,
    maxWidth: 360, alignSelf: 'center', width: '100%',
  },
  numpadKey: {
    width: '30%', height: 56,
    backgroundColor: '#122012', borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#1E3A1E',
  },
  numpadKeyText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  saveButton: {
    backgroundColor: '#4ADE80', borderRadius: 16,
    height: 58, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#4ADE80', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  saveButtonText: { color: '#0A1F0A', fontSize: 17, fontWeight: '800' },
});

export default EditExpense;