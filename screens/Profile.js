import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  TextInput, Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { signOut, updatePassword, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getBudget, setBudget } from '../services/budgetService';

const Profile = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [budget, setBudgetState] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const user = auth.currentUser;

  useEffect(() => {
    const load = async () => {
      const currentBudget = await getBudget();
      setBudgetState(currentBudget.toString());
      setDisplayName(user?.displayName || '');
      setLoading(false);
    };
    load();
  }, []);

  const handleSaveBudget = async () => {
    if (!budget || isNaN(budget) || parseFloat(budget) <= 0) {
      Alert.alert('Error', 'Please enter a valid budget amount');
      return;
    }
    setSaving(true);
    const result = await setBudget(parseFloat(budget));
    setSaving(false);
    if (result.success) {
      Alert.alert('Success', 'Budget updated!');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleSaveName = async () => {
    if (!displayName.trim()) {
      Alert.alert('Error', 'Please enter a display name');
      return;
    }
    setSaving(true);
    try {
      await updateProfile(user, { displayName: displayName.trim() });
      Alert.alert('Success', 'Name updated!');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    setSaving(true);
    try {
      await updatePassword(user, newPassword);
      setNewPassword('');
      Alert.alert('Success', 'Password changed!');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => signOut(auth) },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile & Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <ActivityIndicator color="#4ADE80" size="large" style={{ marginTop: 60 }} />
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(user?.displayName || user?.email || '?')[0].toUpperCase()}
              </Text>
            </View>
            <Text style={styles.emailText}>{user?.email}</Text>
          </View>

          {/* Display Name */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Display Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#4A7A44"
              value={displayName}
              onChangeText={setDisplayName}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveName} disabled={saving}>
              <Text style={styles.saveButtonText}>Save Name</Text>
            </TouchableOpacity>
          </View>

          {/* Monthly Budget */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Monthly Budget</Text>
            <Text style={styles.cardSubtitle}>Set how much you want to spend this month</Text>
            <View style={styles.budgetInputRow}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.budgetInput}
                placeholder="500"
                placeholderTextColor="#4A7A44"
                value={budget}
                onChangeText={setBudgetState}
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveBudget} disabled={saving}>
              {saving ? (
                <ActivityIndicator color="#0A1F0A" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>Save Budget</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Change Password */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Change Password</Text>
            <TextInput
              style={styles.input}
              placeholder="New password (min 6 chars)"
              placeholderTextColor="#4A7A44"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword} disabled={saving}>
              <Text style={styles.saveButtonText}>Change Password</Text>
            </TouchableOpacity>
          </View>

          {/* Logout */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </ScrollView>
      )}
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
  scrollView: { flex: 1, paddingHorizontal: 20 },
  avatarSection: { alignItems: 'center', paddingVertical: 28 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#4ADE80', alignItems: 'center',
    justifyContent: 'center', marginBottom: 12,
  },
  avatarText: { color: '#0A1F0A', fontSize: 32, fontWeight: '800' },
  emailText: { color: '#6AAD6A', fontSize: 14 },
  card: {
    backgroundColor: '#122012', borderRadius: 16,
    padding: 20, marginBottom: 16,
    borderWidth: 1, borderColor: '#1E3A1E',
  },
  cardTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginBottom: 6 },
  cardSubtitle: { color: '#6AAD6A', fontSize: 12, marginBottom: 14 },
  input: {
    backgroundColor: '#1A3A1A', borderRadius: 10,
    paddingHorizontal: 14, height: 48,
    color: '#FFFFFF', fontSize: 14, marginBottom: 12,
  },
  budgetInputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1A3A1A', borderRadius: 10,
    paddingHorizontal: 14, height: 48, marginBottom: 12,
  },
  currencySymbol: { color: '#4ADE80', fontSize: 18, fontWeight: '700', marginRight: 6 },
  budgetInput: { flex: 1, color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  saveButton: {
    backgroundColor: '#4ADE80', borderRadius: 10,
    height: 46, alignItems: 'center', justifyContent: 'center',
  },
  saveButtonText: { color: '#0A1F0A', fontSize: 15, fontWeight: '700' },
  logoutButton: {
    backgroundColor: '#1A0A0A', borderRadius: 14,
    height: 52, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#EF4444',
    marginBottom: 16,
  },
  logoutText: { color: '#EF4444', fontSize: 16, fontWeight: '700' },
});

export default Profile;