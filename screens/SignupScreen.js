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
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../AuthContext';
import { ArrowRight } from 'lucide-react-native';

export default function SignupScreen({ navigation }) {
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
      style={[styles.container, { backgroundColor: '#fdf3e9' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'none'}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fdf3e9"
      />
      
      {/* Header Gradient */}
      <LinearGradient
        colors={['#fdf3e9', '#fce8d9']}
        style={styles.headerGradient}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>✨</Text>
          </View>
          <Text style={[styles.title, { color: '#1a1a1a' }]}>
            CapChat
          </Text>
          <Text style={[styles.subtitle, { color: '#5a5a5a' }]}>
            your vibe ✨
          </Text>
        </View>
      </LinearGradient>

      {/* Form Container */}
      <ScrollView
        style={[styles.formContainer, { backgroundColor: '#fdf3e9' }]}
        contentContainerStyle={styles.formContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.formTitle}>Create Account</Text>
        
        {/* Username Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>USERNAME</Text>
          <View style={[
            styles.inputWrapper,
            {
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              borderColor: errors.username ? '#d9594d' : 'rgba(0, 0, 0, 0.1)',
            }
          ]}>
            <TextInput
              style={[styles.input, { color: '#1a1a1a' }]}
              placeholder="your name here"
              placeholderTextColor="#bbb"
              value={username}
              onChangeText={setUsername}
              editable={!loading}
            />
          </View>
          {errors.username && (
            <Text style={[styles.errorText, { color: '#d9594d' }]}>
              {errors.username}
            </Text>
          )}
        </View>

        {/* Email Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>EMAIL</Text>
          <View style={[
            styles.inputWrapper,
            {
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              borderColor: errors.email ? '#d9594d' : 'rgba(0, 0, 0, 0.1)',
            }
          ]}>
            <TextInput
              style={[styles.input, { color: '#1a1a1a' }]}
              placeholder="your email here"
              placeholderTextColor="#bbb"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={!loading}
            />
          </View>
          {errors.email && (
            <Text style={[styles.errorText, { color: '#d9594d' }]}>
              {errors.email}
            </Text>
          )}
        </View>

        {/* Password Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>SECRET KEY</Text>
          <View style={[
            styles.inputWrapper,
            {
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              borderColor: errors.password ? '#d9594d' : 'rgba(0, 0, 0, 0.1)',
            }
          ]}>
            <TextInput
              style={[styles.input, { color: '#1a1a1a' }]}
              placeholder="••••••••"
              placeholderTextColor="#bbb"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
              editable={!loading}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Text style={styles.toggleText}>
                {passwordVisible ? '👁' : '👁‍🗨'}
              </Text>
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text style={[styles.errorText, { color: '#d9594d' }]}>
              {errors.password}
            </Text>
          )}
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>CONFIRM SECRET KEY</Text>
          <View style={[
            styles.inputWrapper,
            {
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              borderColor: errors.confirmPassword ? '#d9594d' : 'rgba(0, 0, 0, 0.1)',
            }
          ]}>
            <TextInput
              style={[styles.input, { color: '#1a1a1a' }]}
              placeholder="••••••••"
              placeholderTextColor="#bbb"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!confirmPasswordVisible}
              editable={!loading}
            />
            <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
              <Text style={styles.toggleText}>
                {confirmPasswordVisible ? '👁' : '👁‍🗨'}
              </Text>
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && (
            <Text style={[styles.errorText, { color: '#d9594d' }]}>
              {errors.confirmPassword}
            </Text>
          )}
        </View>

        {/* Signup Button with Gradient */}
        <LinearGradient
          colors={['#a0644e', '#c97068']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientButton}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleSignup}
            disabled={loading}
            activeOpacity={0.75}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Sign up</Text>
                <ArrowRight size={20} color="#fff" strokeWidth={2.5} />
              </View>
            )}
          </TouchableOpacity>
        </LinearGradient>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            Already here?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>
              Log In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#fdf3e9',
  },
  formContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1a1a1a',
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8a8a8a',
    letterSpacing: 1,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  toggleText: {
    fontSize: 18,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 6,
    marginLeft: 4,
  },
  gradientButton: {
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 24,
    marginTop: 4,
  },
  button: {
    borderRadius: 28,
    paddingVertical: 16,
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
    fontSize: 17,
    fontWeight: '700',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  loginText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7a7a7a',
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#a0644e',
  },
});
