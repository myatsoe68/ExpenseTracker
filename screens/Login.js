import React, { useState } from 'react';
import {
  View, Text, TextInput,
  TouchableOpacity, StyleSheet, Alert, Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

const Login = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(route?.params?.mode === 'register');
  const [errorMessage, setErrorMessage] = useState('');

  const getFriendlyAuthError = (error) => {
    switch (error?.code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Invalid email or password.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Try again later.';
      case 'auth/email-already-in-use':
        return 'This email is already registered.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      default:
        return error?.message || 'Authentication failed. Please try again.';
    }
  };

  const showAuthError = (message) => {
    setErrorMessage(message);
    if (Platform.OS === 'web') {
      window.alert(message);
      return;
    }
    Alert.alert('Error', message);
  };

  const handleAuth = async () => {
    setErrorMessage('');
    if (!email || !password) {
      showAuthError('Please fill in all fields');
      return;
    }
    setIsLoading(true);
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      showAuthError(getFriendlyAuthError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Landing')}>
        <Text style={styles.backButtonText}>← Back to overview</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Securely manage your expenses and savings</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="name@example.com"
            placeholderTextColor="#4A7A44"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Enter your password"
            placeholderTextColor="#4A7A44"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.eyeIcon}>{showPassword ? '👁' : '👁‍🗨'}</Text>
          </TouchableOpacity>
        </View>

        {!!errorMessage && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.authButton} onPress={handleAuth} disabled={isLoading}>
          <Text style={styles.authButtonText}>
            {isLoading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => setIsRegister(!isRegister)}
        >
          <Text style={styles.switchText}>
            {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1F0A' },
  backButton: { paddingHorizontal: 24, paddingTop: 8, alignSelf: 'flex-start' },
  backButtonText: { color: '#4ADE80', fontSize: 14, fontWeight: '700' },
  header: { alignItems: 'center', paddingTop: 60, paddingBottom: 40, paddingHorizontal: 24 },
  title: { color: '#FFFFFF', fontSize: 36, fontWeight: '800', marginBottom: 12 },
  subtitle: { color: '#6AAD6A', fontSize: 16, textAlign: 'center', lineHeight: 24 },
  form: { paddingHorizontal: 24 },
  label: { color: '#FFFFFF', fontSize: 15, fontWeight: '600', marginBottom: 10 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#122012', borderRadius: 14,
    borderWidth: 1, borderColor: '#2A4A2A',
    paddingHorizontal: 16, height: 56, marginBottom: 20,
  },
  input: { flex: 1, color: '#FFFFFF', fontSize: 15 },
  eyeIcon: { fontSize: 18 },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.35)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  errorText: { color: '#FCA5A5', fontSize: 14, fontWeight: '600', lineHeight: 20 },
  authButton: {
    backgroundColor: '#4ADE80', borderRadius: 16,
    height: 58, alignItems: 'center', justifyContent: 'center',
    marginTop: 10, marginBottom: 20,
    shadowColor: '#4ADE80', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  authButtonText: { color: '#0A1F0A', fontSize: 18, fontWeight: '800' },
  switchButton: { alignItems: 'center' },
  switchText: { color: '#4ADE80', fontSize: 14, fontWeight: '600' },
});

export default Login;