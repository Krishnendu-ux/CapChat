import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ThemeProvider, useTheme} from './ThemeContext';
import {AuthProvider, useAuth} from './AuthContext';
import ChatScreen from './screens/ChatScreen';
import ChatDetailScreen from './screens/ChatDetailScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';

const Stack = createNativeStackNavigator();

function AuthNavigator() {
  const {theme} = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: theme.colors.mainBackground,
        },
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function ChatNavigator() {
  const {theme} = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.headerBg,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 4},
          shadowOpacity: 0.3,
          shadowRadius: 5,
        },
        headerTintColor: theme.colors.primaryText,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 20,
          color: theme.colors.primaryText,
        },
        cardStyle: {
          backgroundColor: theme.colors.mainBackground,
        },
      }}>
      <Stack.Screen
        name="Chats"
        component={ChatScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ChatDetail"
        component={ChatDetailScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: '👤 My Profile',
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  );
}

function AppNavigator() {
  const {isAuthenticated, loading} = useAuth();

  if (loading) {
    return null; // You can show a splash screen here
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <ChatNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}
