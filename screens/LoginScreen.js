import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../ThemeContext';
import { useAuth } from '../AuthContext';
import { Mail, Lock, ArrowRight } from 'lucide-react-native';

export default function LoginScreen({ navigation }) {
  const { theme } = useTheme();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await login(email, password);
      setEmail('');
      setPassword('');
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Please check your credentials');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.mainBackground }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'none'}>
      <StatusBar
        barStyle={theme.name === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.headerBg}
      />
      
      {/* Header Gradient */}
      <LinearGradient
        colors={[theme.colors.headerBg, theme.colors.mainBackground]}
        style={styles.headerGradient}>
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: theme.colors.primaryText }]}>
            Welcome Back
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.secondaryText }]}>
            Login to CapChat
          </Text>
        </View>
      </LinearGradient>

      {/* Form Container */}
      <View style={styles.formContainer}>
        
        {/* Email Input */}
        <View style={styles.inputGroup}>
          <View style={[
            styles.inputWrapper,
            {
              backgroundColor: theme.colors.surface,
              borderColor: errors.email ? theme.colors.destructive : theme.colors.borderColor,
            }
          ]}>
            <Mail size={20} color={theme.colors.secondaryText} />
            <TextInput
              style={[styles.input, { color: theme.colors.primaryText }]}
              placeholder="Email"
              placeholderTextColor={theme.colors.secondaryText}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={!loading}
            />
          </View>
          {errors.email && (
            <Text style={[styles.errorText, { color: theme.colors.destructive }]}>
              {errors.email}
            </Text>
          )}
        </View>

        {/* Password Input */}
        <View style={styles.inputGroup}>
          <View style={[
            styles.inputWrapper,
            {
              backgroundColor: theme.colors.surface,
              borderColor: errors.password ? theme.colors.destructive : theme.colors.borderColor,
            }
          ]}>
            <Lock size={20} color={theme.colors.secondaryText} />
            <TextInput
              style={[styles.input, { color: theme.colors.primaryText }]}
              placeholder="Password"
              placeholderTextColor={theme.colors.secondaryText}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
              editable={!loading}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Text style={[styles.toggleText, { color: theme.colors.brandAccent }]}>
                {passwordVisible ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text style={[styles.errorText, { color: theme.colors.destructive }]}>
              {errors.password}
            </Text>
          )}
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.brandAccent }]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.75}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Login</Text>
              <ArrowRight size={20} color="#fff" />
            </View>
          )}
        </TouchableOpacity>

        {/* Signup Link */}
        <View style={styles.signupContainer}>
          <Text style={[styles.signupText, { color: theme.colors.secondaryText }]}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={[styles.signupLink, { color: theme.colors.brandAccent }]}>
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 6,
    marginLeft: 4,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signupText: {
    fontSize: 14,
    fontWeight: '500',
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '700',
  },
});
