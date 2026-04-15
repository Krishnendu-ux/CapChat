import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  Modal,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../ThemeContext';
import { Search, Settings, Plus, Moon, Sun, Edit, LogOut } from 'lucide-react-native';

export default function ChatScreen({navigation}) {
  const {theme, isDarkMode, toggleTheme} = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  const chats = [
    {
      id: '1',
      name: 'Ravi',
      message: 'Yo! that was crazy 🔥',
      time: '10:30',
      imageSource: require('../assets/ravi.jpeg'),
      unread: 2,
      online: true,
    },
    {
      id: '2',
      name: 'Raju',
      message: 'omg same energy fr fr',
      time: '09:15',
      imageSource: require('../assets/raju.png'),
      unread: 0,
      online: true,
    },
    {
      id: '3',
      name: 'The Squad',
      message: 'Let\'s meet up later ✨',
      time: 'Yesterday',
      imageSource: require('../assets/the\ squad.jpeg'),
      unread: 3,
      online: false,
    },
    {
      id: '4',
      name: 'Mom ❤️',
      message: 'Have you eaten baby?',
      time: 'Mon',
      imageSource: require('../assets/mom.jpeg'),
      unread: 1,
      online: false,
    },
  ];

  const renderChat = ({item}) => (
    <TouchableOpacity
      style={[styles.chatItem, {borderBottomColor: theme.colors.borderColor}]}
      onPress={() =>
        navigation.navigate('ChatDetail', {name: item.name, id: item.id})
      }
      activeOpacity={0.6}>
      <View style={styles.avatarWrapper}>
        <Image
          source={item.imageSource}
          style={styles.avatarContainer}
        />
        {item.online && <View style={[styles.onlineDot, {backgroundColor: '#4ade80'}]} />}
      </View>

      <View style={styles.chatContentWrapper}>
        <View style={styles.chatHeaderRow}>
          <Text style={[styles.chatName, {color: theme.colors.primaryText}]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.chatTime, {color: theme.colors.secondaryText}]}>
            {item.time}
          </Text>
        </View>
        <Text
          style={[styles.chatMessage, {color: theme.colors.secondaryText}]}
          numberOfLines={1}>
          {item.message}
        </Text>
      </View>

      {item.unread > 0 && (
        <View
          style={[
            styles.unreadBadge,
            {backgroundColor: theme.colors.brandAccent},
          ]}>
          <Text style={styles.unreadText}>{item.unread}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.mainBackground}]}>
      <StatusBar
        barStyle={theme.name === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.headerBg}
      />

      {/* Header with gradient */}
      <LinearGradient
        colors={[theme.colors.headerBg, theme.colors.mainBackground]}
        style={styles.headerGradient}>
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.headerTitle, {color: theme.colors.primaryText}]}>
              CapChat
            </Text>
            <Text style={[styles.headerSubtitle, {color: theme.colors.secondaryText}]}>
              your vibe ✨
            </Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.headerIconBtn} onPress={() => setShowMenu(true)}>
              <Settings size={22} color={theme.colors.brandAccent} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search bar */}
        <View style={[styles.searchContainer, {backgroundColor: theme.colors.surface, borderColor: theme.colors.borderColor}]}>
          <Search size={18} color={theme.colors.secondaryText} />
          <TextInput
            style={[styles.searchInput, {color: theme.colors.primaryText}]}
            placeholder="search or start new chat"
            placeholderTextColor={theme.colors.secondaryText}
          />
        </View>
      </LinearGradient>

      {/* Chat list */}
      <FlatList
        data={chats}
        renderItem={renderChat}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        scrollIndicatorInsets={{right: 1}}
      />

      {/* Floating action button */}
      <TouchableOpacity
        style={[
          styles.fab,
          {backgroundColor: theme.colors.brandAccent},
        ]}
        onPress={() => alert('Start a new chat!')}
        activeOpacity={0.75}>
        <Plus size={28} color="#fff" />
      </TouchableOpacity>

      {/* Settings Menu Modal */}
      <Modal visible={showMenu} transparent animationType="fade">
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}>
          <View style={[styles.menuContainer, {backgroundColor: theme.colors.surface, borderColor: theme.colors.borderColor}]}>
            <TouchableOpacity 
              style={[styles.menuItem, {borderBottomColor: theme.colors.borderColor}]}
              onPress={() => {
                toggleTheme();
                setShowMenu(false);
              }}>
              <View style={styles.menuIconLeft}>
                {isDarkMode ? (
                  <Sun size={20} color={theme.colors.brandAccent} />
                ) : (
                  <Moon size={20} color={theme.colors.brandAccent} />
                )}
              </View>
              <Text style={[styles.menuText, {color: theme.colors.primaryText}]}>
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuItem, {borderBottomColor: theme.colors.borderColor}]}
              onPress={() => {
                navigation.navigate('Profile');
                setShowMenu(false);
              }}>
              <View style={styles.menuIconLeft}>
                <Edit size={20} color={theme.colors.brandAccent} />
              </View>
              <Text style={[styles.menuText, {color: theme.colors.primaryText}]}>
                My Profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                alert('Logout');
                setShowMenu(false);
              }}>
              <View style={styles.menuIconLeft}>
                <LogOut size={20} color={theme.colors.destructive} />
              </View>
              <Text style={[styles.menuText, {color: theme.colors.destructive}]}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontFamily: 'Georgia',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.50,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerSubtitle: {
    fontFamily: 'System',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  searchInput: {
    fontFamily: 'System',
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    paddingTop: 8,
  },
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    alignItems: 'center',
    gap: 12,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  avatarText: {
    fontSize: 28,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#fff',
  },
  chatContentWrapper: {
    flex: 1,
  },
  chatHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  chatName: {
    fontFamily: 'System',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    flex: 1,
  },
  chatTime: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '400',
    marginLeft: 8,
  },
  chatMessage: {
    fontFamily: 'System',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  },
  unreadBadge: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  unreadText: {
    fontFamily: 'System',
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    paddingTop: 60,
    paddingRight: 16,
  },
  menuContainer: {
    alignSelf: 'flex-end',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    minWidth: 180,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  menuIconLeft: {
    marginRight: 12,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
