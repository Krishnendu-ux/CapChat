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

export default function LoginScreen({ navigation }) {
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
      style={[styles.container, { backgroundColor: '#fdf3e9' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'none'}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fdf3e9"
      />
      
      {/* Header with Logo */}
      <LinearGradient
        colors={['#fdf3e9', '#fce8d9']}
        style={styles.headerGradient}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>💬</Text>
          </View>
          <Text style={[styles.title, { color: '#1a1a1a' }]}>
            CapChat
          </Text>
          <Text style={[styles.subtitle, { color: '#7a7a7a' }]}>
            your vibe ✨
          </Text>
        </View>
      </LinearGradient>

      {/* Form Container */}
      <ScrollView
        style={[styles.formContainer, { backgroundColor: '#fdf3e9' }]}
        contentContainerStyle={styles.formContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.formTitle}>Welcome Back</Text>
        
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
              placeholder="Your email here"
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

        {/* Forgot Password Link */}
        <TouchableOpacity style={styles.forgotContainer}>
          <Text style={styles.forgotText}>Forgot secret key?</Text>
        </TouchableOpacity>
        
        {/* Login Button with Gradient */}
        <LinearGradient
          colors={['#a0644e', '#c97068']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientButton}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.75}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Login</Text>
                <ArrowRight size={20} color="#fff" strokeWidth={2.5} />
              </View>
            )}
          </TouchableOpacity>
        </LinearGradient>

        {/* OR Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OR SIGN IN WITH</Text>
          <View style={styles.divider} />
        </View>

        {/* Social Login Buttons */}
        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialText}>G</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialText}>f</Text>
          </TouchableOpacity>
        </View>

        {/* Signup Link */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>
            New to the CapChat?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupLink}>
              Sign Up
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
    paddingTop: 40,
    paddingBottom: 40,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1a1a1a',
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
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
  forgotContainer: {
    alignItems: 'flex-end',
    marginBottom: 28,
  },
  forgotText: {
    color: '#a0644e',
    fontSize: 14,
    fontWeight: '700',
  },
  gradientButton: {
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 28,
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
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8a8a8a',
    letterSpacing: 0.8,
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
    marginBottom: 32,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  socialText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  signupText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7a7a7a',
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#a0644e',
  },
});
