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
import { Mail, Lock, User, ArrowRight } from 'lucide-react-native';

export default function SignupScreen({ navigation }) {
  const { theme } = useTheme();
  const { signup, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
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
    
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await signup(email, password, username);
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert('Signup Failed', error.message || 'Please try again');
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
            Join CapChat
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.secondaryText }]}>
            Create your account
          </Text>
        </View>
      </LinearGradient>

      {/* Form Container */}
      <View style={styles.formContainer}>
        
        {/* Username Input */}
        <View style={styles.inputGroup}>
          <View style={[
            styles.inputWrapper,
            {
              backgroundColor: theme.colors.surface,
              borderColor: errors.username ? theme.colors.destructive : theme.colors.borderColor,
            }
          ]}>
            <User size={20} color={theme.colors.secondaryText} />
            <TextInput
              style={[styles.input, { color: theme.colors.primaryText }]}
              placeholder="Username"
              placeholderTextColor={theme.colors.secondaryText}
              value={username}
              onChangeText={setUsername}
              editable={!loading}
            />
          </View>
          {errors.username && (
            <Text style={[styles.errorText, { color: theme.colors.destructive }]}>
              {errors.username}
            </Text>
          )}
        </View>

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

        {/* Confirm Password Input */}
        <View style={styles.inputGroup}>
          <View style={[
            styles.inputWrapper,
            {
              backgroundColor: theme.colors.surface,
              borderColor: errors.confirmPassword ? theme.colors.destructive : theme.colors.borderColor,
            }
          ]}>
            <Lock size={20} color={theme.colors.secondaryText} />
            <TextInput
              style={[styles.input, { color: theme.colors.primaryText }]}
              placeholder="Confirm Password"
              placeholderTextColor={theme.colors.secondaryText}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!confirmPasswordVisible}
              editable={!loading}
            />
            <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
              <Text style={[styles.toggleText, { color: theme.colors.brandAccent }]}>
                {confirmPasswordVisible ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && (
            <Text style={[styles.errorText, { color: theme.colors.destructive }]}>
              {errors.confirmPassword}
            </Text>
          )}
        </View>

        {/* Signup Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.brandAccent }]}
          onPress={handleSignup}
          disabled={loading}
          activeOpacity={0.75}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Create Account</Text>
              <ArrowRight size={20} color="#fff" />
            </View>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={[styles.loginText, { color: theme.colors.secondaryText }]}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.loginLink, { color: theme.colors.brandAccent }]}>
              Login
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
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 16,
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  loginText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
  },
});
