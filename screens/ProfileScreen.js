import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '../ThemeContext';
import {requestCameraPermission} from '../permissionsHelper';
import { Camera, Moon, Sun, LogOut, Edit3, Zap, MessageCircle } from 'lucide-react-native';

export default function ProfileScreen({navigation}) {
  const {theme, isDarkMode, toggleTheme} = useTheme();

  const handleCameraPress = async () => {
    const granted = await requestCameraPermission();
    if (granted) {
      alert('Camera access granted! 📸');
    } else {
      alert('Camera access denied');
    }
  };

  return (
    <ScrollView style={[styles.container, {backgroundColor: '#fdf3e9'}]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fdf3e9"
      />

      {/* Profile Header with Gradient */}
      <LinearGradient
        colors={['#a0644e', '#fdf3e9', '#b8a896']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.headerGradient}>
        <View style={styles.profileImageContainer}>
          <Image
            source={require('../assets/me2.jpeg')}
            style={styles.profileImage}
          />
        </View>

        <View style={styles.profileInfoCard}>
          <Text style={styles.profileName}>Your Vibe</Text>
          <Text style={styles.profileBio}>
            Curating digital aesthetics & whispering to algorithms. Based in the ether, living for the vibe. ✨
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12.8k</Text>
              <Text style={styles.statLabel}>FOLLOWERS</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>99%</Text>
              <Text style={styles.statLabel}>VIBE CHECK</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Actions Section */}
      <View style={styles.section}>
        <View style={styles.actionCard}>
          <View style={styles.actionCardIcon}>
            <Text style={styles.actionCardIconText}>🔒</Text>
          </View>
          <Text style={styles.actionCardTitle}>Profile Privacy</Text>
          <Text style={styles.actionCardSubtitle}>Control who sees your main character arc</Text>
        </View>

        <View style={styles.actionCard}>
          <View style={styles.actionCardIcon}>
            <Text style={styles.actionCardIconText}>✨</Text>
          </View>
          <Text style={styles.actionCardTitle}>Aesthetic Kit</Text>
          <Text style={styles.actionCardSubtitle}>Customize your chat bubbles and glass levels</Text>
        </View>

        <View style={styles.actionCard}>
          <View style={styles.actionCardIcon}>
            <Text style={styles.actionCardIconText}>🔔</Text>
          </View>
          <Text style={styles.actionCardTitle}>Notification Flow</Text>
          <Text style={styles.actionCardSubtitle}>Keep it quiet during your zen hours</Text>
        </View>
      </View>

      <View style={{height: 30}} />
    </ScrollView>
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
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 280,
    height: 360,
    borderRadius: 32,
  },
  profileInfoCard: {
    paddingHorizontal: 20,
  },
  profileName: {
    fontSize: 42,
    fontWeight: '900',
    color: '#1a1a1a',
    marginBottom: 12,
    letterSpacing: -1,
  },
  profileBio: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6a6a6a',
    lineHeight: 20,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8a8a8a',
    letterSpacing: 0.5,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
    marginTop: 20,
  },
  actionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  actionCardIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: 'rgba(160, 100, 78, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionCardIconText: {
    fontSize: 24,
  },
  actionCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  actionCardSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6a6a6a',
    lineHeight: 18,
  },
});
