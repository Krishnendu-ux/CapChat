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
    <ScrollView style={[styles.container, {backgroundColor: theme.colors.mainBackground}]}>
      <StatusBar
        barStyle={theme.name === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.headerBg}
      />

      {/* Profile Header with Gradient */}
      <LinearGradient
        colors={[theme.colors.headerBg, theme.colors.mainBackground]}
        style={styles.headerGradient}>
        <View style={[styles.profileHeader, {backgroundColor: theme.colors.surface, borderColor: theme.colors.borderColor}]}>
          <Image
            source={require('../assets/me2.jpeg')}
            style={styles.avatar}
          />

          <TouchableOpacity style={styles.editBtn}>
            <Edit3 size={18} color={theme.colors.brandAccent} />
          </TouchableOpacity>

          <Text style={[styles.name, {color: theme.colors.primaryText}]}>
            Your Vibe Check
          </Text>
          <Text style={[styles.phone, {color: theme.colors.secondaryText}]}>
            +1 234 567 8900
          </Text>

          <View style={[styles.statusBadge, {backgroundColor: theme.colors.brandAccent}]}>
            <Zap size={14} color="#fff" />
            <Text style={styles.statusText}>Active rn ✨</Text>
          </View>
        </View>
      </LinearGradient>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, {color: theme.colors.secondaryText}]}>
          about you
        </Text>
        <View style={[styles.infoCard, {backgroundColor: theme.colors.surface, borderColor: theme.colors.borderColor}]}>
          <View style={[styles.infoRow, {borderBottomColor: theme.colors.borderColor}]}>
            <View style={styles.infoLeft}>
              <MessageCircle size={20} color={theme.colors.brandAccent} />
              <Text style={[styles.infoLabel, {color: theme.colors.primaryText}]}>Status</Text>
            </View>
            <Text style={[styles.infoValue, {color: theme.colors.secondaryText}]}>Always vibing 🎵</Text>
          </View>

          <View style={[styles.infoRow, {borderBottomColor: theme.colors.borderColor}]}>
            <View style={styles.infoLeft}>
              <Zap size={20} color={theme.colors.brandAccent} />
              <Text style={[styles.infoLabel, {color: theme.colors.primaryText}]}>Mood</Text>
            </View>
            <Text style={[styles.infoValue, {color: theme.colors.secondaryText}]}>lit fr fr 🔥</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              {isDarkMode ? (
                <Moon size={20} color={theme.colors.brandAccent} />
              ) : (
                <Sun size={20} color={theme.colors.brandAccent} />
              )}
              <Text style={[styles.infoLabel, {color: theme.colors.primaryText}]}>Theme</Text>
            </View>
            <Text style={[styles.infoValue, {color: theme.colors.secondaryText}]}>
              {isDarkMode ? 'Dark Mode 🌙' : 'Light Mode ☀️'}
            </Text>
          </View>
        </View>
      </View>

      {/* Actions Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, {color: theme.colors.secondaryText}]}>
          quick actions
        </Text>

        <LinearGradient
          colors={[theme.colors.brandAccent, theme.colors.secondaryAccent]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.actionButton}>
          <TouchableOpacity
            style={styles.actionContent}
            onPress={handleCameraPress}
            activeOpacity={0.75}>
            <Camera size={24} color="#fff" />
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>Snap a Photo</Text>
              <Text style={styles.actionSubtitle}>show your vibe</Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>

        <TouchableOpacity
          style={[styles.actionButton2, {backgroundColor: theme.colors.surface, borderColor: theme.colors.borderColor}]}
          onPress={toggleTheme}
          activeOpacity={0.75}>
          <View style={styles.actionContent}>
            {isDarkMode ? (
              <Sun size={24} color={theme.colors.brandAccent} />
            ) : (
              <Moon size={24} color={theme.colors.brandAccent} />
            )}
            <View style={styles.actionText}>
              <Text style={[styles.actionTitle, {color: theme.colors.primaryText}]}>
                {isDarkMode ? 'Go Light' : 'Go Dark'}
              </Text>
              <Text style={[styles.actionSubtitle, {color: theme.colors.secondaryText}]}>
                {isDarkMode ? 'bright & fresh' : 'cozy vibes'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton2, {backgroundColor: theme.colors.surface, borderColor: theme.colors.borderColor}]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.75}>
          <View style={styles.actionContent}>
            <MessageCircle size={24} color={theme.colors.brandAccent} />
            <View style={styles.actionText}>
              <Text style={[styles.actionTitle, {color: theme.colors.primaryText}]}>Back to Chats</Text>
              <Text style={[styles.actionSubtitle, {color: theme.colors.secondaryText}]}>keep chatting fr</Text>
            </View>
          </View>
        </TouchableOpacity>
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
    paddingBottom: 20,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 40,
    borderRadius: 20,
    margin: 16,
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  avatarText: {
    fontSize: 56,
  },
  editBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontFamily: 'Georgia',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  phone: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  statusText: {
    fontFamily: 'System',
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  infoCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoLabel: {
    fontFamily: 'System',
    fontSize: 15,
    fontWeight: '600',
  },
  infoValue: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '500',
  },
  actionButton: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  actionButton2: {
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 14,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  actionSubtitle: {
    fontFamily: 'System',
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
});
