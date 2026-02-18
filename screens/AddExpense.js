import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CATEGORIES = [
  { id: '1', label: 'Food', icon: '🍴' },
  { id: '2', label: 'Transport', icon: '🚌' },
  { id: '3', label: 'Shopping', icon: '🛍' },
  { id: '4', label: 'Education', icon: '📚' },
  { id: '5', label: 'Health', icon: '💊' },
  { id: '6', label: 'Other', icon: '💡' },
];

const NUMPAD_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'];

const AddExpense = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState('0');
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [note, setNote] = useState('');

  const today = new Date();
  const dateLabel = `Today, ${today.toLocaleString('default', { month: 'short' })} ${today.getDate()}`;

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

  const handleAddExpense = () => {
    if (!amount || parseFloat(amount) === 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    Alert.alert('Success', `Expense of $${amount} added!`, [
      { text: 'OK', onPress: () => navigation.navigate('Home') },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerClose}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Expense</Text>
        <TouchableOpacity onPress={handleAddExpense}>
          <Text style={styles.headerCheck}>✓</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* Amount Display */}
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>AMOUNT</Text>
          <View style={styles.amountRow}>
            <Text style={styles.currencySymbol}>$</Text>
            <Text style={styles.amountValue}>{amount}</Text>
          </View>
        </View>

        {/* Category Selector — Horizontal Scroll Carousel */}
        <View style={styles.categorySection}>
          <Text style={styles.sectionLabel}>Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === cat.id && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Text style={styles.categoryChipIcon}>{cat.icon}</Text>
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategory === cat.id && styles.categoryChipTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Date Row */}
        <TouchableOpacity style={styles.dateRow}>
          <View style={styles.dateLeft}>
            <Text style={styles.dateIcon}>📅</Text>
            <Text style={styles.dateText}>Transaction Date</Text>
          </View>
          <Text style={styles.dateValue}>{dateLabel}</Text>
        </TouchableOpacity>

        {/* Note Input */}
        <View style={styles.noteContainer}>
          <TextInput
            style={styles.noteInput}
            placeholder="Add a note (e.g. Lunch with Sarah)"
            placeholderTextColor="#4A7A44"
            value={note}
            onChangeText={setNote}
          />
        </View>

        {/* Custom Numpad */}
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

        {/* Add Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
          <Text style={styles.addButtonText}>Add Expense  ⊕</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1F0A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerClose: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  headerCheck: {
    color: '#4ADE80',
    fontSize: 22,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  amountSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  amountLabel: {
    color: '#4ADE80',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 12,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  currencySymbol: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    marginTop: 10,
    marginRight: 4,
  },
  amountValue: {
    color: '#FFFFFF',
    fontSize: 68,
    fontWeight: '800',
    letterSpacing: -2,
  },
  categorySection: {
    marginBottom: 16,
  },
  sectionLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  categoryScroll: {
    paddingRight: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#122012',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#1E3A1E',
    marginRight: 10,
  },
  categoryChipActive: {
    backgroundColor: '#4ADE80',
    borderColor: '#4ADE80',
  },
  categoryChipIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryChipText: {
    color: '#6AAD6A',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: '#0A1F0A',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#122012',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1E3A1E',
  },
  dateLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  dateValue: {
    color: '#4ADE80',
    fontSize: 14,
    fontWeight: '700',
  },
  noteContainer: {
    backgroundColor: '#122012',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E3A1E',
    paddingHorizontal: 16,
    height: 52,
    justifyContent: 'center',
    marginBottom: 20,
  },
  noteInput: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  numpad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  numpadKey: {
    width: '30%',
    aspectRatio: 1.6,
    backgroundColor: '#122012',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1E3A1E',
  },
  numpadKeyText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#4ADE80',
    borderRadius: 16,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4ADE80',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  addButtonText: {
    color: '#0A1F0A',
    fontSize: 17,
    fontWeight: '800',
  },
});

export default AddExpense;