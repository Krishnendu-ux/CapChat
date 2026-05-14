import React, {useState, useEffect} from 'react';
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
  Alert,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../ThemeContext';
import { useAuth } from '../AuthContext';
import { Search, Settings, Plus, Moon, Sun, Edit, LogOut, X, ArrowLeft, Check } from 'lucide-react-native';
import chatAPI from '../api';
import contactsData from '../contactsData';

export default function ChatScreen({navigation}) {
  const {theme, isDarkMode, toggleTheme} = useTheme();
  const {logout, user} = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [chats, setChats] = useState([
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
  ]);

  // Handle search with priority/relevance scoring
  const handleSearch = async (text) => {
    setSearchQuery(text);
    
    if (text.trim().length === 0) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const searchLower = text.toLowerCase();
      
      // Score each chat based on relevance
      const scoredChats = chats.map(chat => {
        const nameLower = chat.name.toLowerCase();
        const messageLower = chat.message.toLowerCase();
        let score = 0;
        let matchType = []; // Track what type of match(es) this is

        // Name matches (highest priority)
        if (nameLower.startsWith(searchLower)) {
          score += 300; // Exact start match in name
          matchType.push('name_start');
        } else if (nameLower.includes(searchLower)) {
          score += 200; // Contains match in name
          matchType.push('name_contains');
        }

        // Message/content matches (medium priority)
        if (messageLower.startsWith(searchLower)) {
          score += 100; // Exact start match in message
          matchType.push('message_start');
        } else if (messageLower.includes(searchLower)) {
          score += 50; // Contains match in message
          matchType.push('message_contains');
        }

        return { ...chat, relevanceScore: score, matchType };
      });

      // Filter chats with matches and sort by score (descending)
      const filtered = scoredChats
        .filter(chat => chat.relevanceScore > 0)
        .sort((a, b) => b.relevanceScore - a.relevanceScore);

      setSearchResults(filtered);
    } catch (error) {
      console.error('Error searching chats:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  // Handle chat press and mark unread as read
  const handleChatPress = async (chat) => {
    if (chat.unread > 0) {
      // Update unread count
      const updatedChats = chats.map(c =>
        c.id === chat.id ? { ...c, unread: 0 } : c
      );
      setChats(updatedChats);
      
      // Mark messages as read in backend
      try {
        await chatAPI.markMessagesAsRead(chat.id, []);
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    }

    // Pass callback to update latest message
    navigation.navigate('ChatDetail', {
      name: chat.name,
      id: chat.id,
      onMessageSent: (latestMessage) => {
        setChats(prevChats =>
          prevChats.map(c =>
            c.id === chat.id
              ? { ...c, message: latestMessage.text || latestMessage, time: 'Just now' }
              : c
          )
        );
      },
    });
  };

  // Handle logout
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              setShowMenu(false);
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  // Handle contact selection
  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setShowConfirmationModal(true);
  };

  // Handle confirming new chat
  const handleConfirmNewChat = () => {
    if (!selectedContact) return;

    const newChat = {
      id: selectedContact.id,
      name: selectedContact.name,
      message: 'No messages yet',
      time: 'Just now',
      imageSource: null,
      unread: 0,
      online: Math.random() > 0.5, // Random online status
      avatar: selectedContact.avatar,
    };

    // Add to chats list
    setChats([newChat, ...chats]);
    
    // Close modals and navigate to chat
    setShowConfirmationModal(false);
    setShowContactsModal(false);
    setSelectedContact(null);
    
    // Navigate to chat detail with callback
    navigation.navigate('ChatDetail', {
      name: newChat.name,
      id: newChat.id,
      onMessageSent: (latestMessage) => {
        setChats(prevChats =>
          prevChats.map(c =>
            c.id === newChat.id
              ? { ...c, message: latestMessage.text || latestMessage, time: 'Just now' }
              : c
          )
        );
      },
    });
  };

  // Render contact item for contacts list
  const renderContactItem = ({item}) => (
    <TouchableOpacity
      style={[styles.contactItem, {
        backgroundColor: theme.name === 'dark' 
          ? 'rgba(255, 255, 255, 0.05)' 
          : 'rgba(0, 0, 0, 0.02)',
        borderColor: theme.name === 'dark'
          ? 'rgba(255, 255, 255, 0.08)'
          : 'rgba(0, 0, 0, 0.05)',
        borderWidth: 1,
      }]}
      onPress={() => handleSelectContact(item)}
      activeOpacity={0.6}>
      <View style={[styles.contactAvatar, {backgroundColor: theme.colors.surface}]}>
        <Text style={styles.contactAvatarText}>{item.avatar}</Text>
      </View>
      <Text style={[styles.contactName, {color: theme.colors.primaryText}]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderChat = ({item}) => (
    <TouchableOpacity
      style={[styles.chatItem, {
        backgroundColor: theme.name === 'dark' 
          ? 'rgba(255, 255, 255, 0.05)' 
          : 'rgba(0, 0, 0, 0.02)',
        borderColor: theme.name === 'dark'
          ? 'rgba(255, 255, 255, 0.08)'
          : 'rgba(0, 0, 0, 0.05)',
        borderWidth: 1,
      }]}
      onPress={() => handleChatPress(item)}
      activeOpacity={0.6}>
      <View style={styles.avatarWrapper}>
        {item.imageSource ? (
          <Image
            source={item.imageSource}
            style={styles.avatarContainer}
          />
        ) : (
          <View style={[styles.avatarContainer, {backgroundColor: theme.colors.surface, justifyContent: 'center', alignItems: 'center'}]}>
            <Text style={{fontSize: 28}}>{item.avatar}</Text>
          </View>
        )}
        {item.online && <View style={[styles.onlineDot, {backgroundColor: '#10b981'}]} />}
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

  // Helper function to render highlighted text
  const renderHighlightedText = (text, query, isName = false) => {
    if (!query || !text) return <Text style={[isName ? styles.searchResultName : styles.searchResultMessage, {color: theme.colors.primaryText}]}>{text}</Text>;
    
    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();
    const index = textLower.indexOf(queryLower);
    
    if (index === -1) {
      return <Text style={[isName ? styles.searchResultName : styles.searchResultMessage, {color: theme.colors.primaryText}]}>{text}</Text>;
    }
    
    const before = text.substring(0, index);
    const match = text.substring(index, index + query.length);
    const after = text.substring(index + query.length);
    
    return (
      <Text style={[isName ? styles.searchResultName : styles.searchResultMessage, {color: theme.colors.primaryText}]}>
        {before}
        <Text style={{backgroundColor: theme.colors.brandAccent, color: theme.name === 'dark' ? '#000' : '#fff', fontWeight: '700'}}>
          {match}
        </Text>
        {after}
      </Text>
    );
  };

  // Render search result with WhatsApp-like styling
  const renderSearchResult = ({item}) => {
    const hasNameMatch = item.matchType && item.matchType.some(t => t.startsWith('name'));
    const hasMessageMatch = item.matchType && item.matchType.some(t => t.startsWith('message'));

    return (
      <TouchableOpacity
        style={[styles.searchResultItem, {
          backgroundColor: theme.name === 'dark' 
            ? 'rgba(255, 255, 255, 0.05)' 
            : 'rgba(0, 0, 0, 0.02)',
          borderColor: theme.name === 'dark'
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(0, 0, 0, 0.05)',
          borderWidth: 1,
        }]}
        onPress={() => handleChatPress(item)}
        activeOpacity={0.6}>
        <View style={styles.avatarWrapper}>
          {item.imageSource ? (
            <Image
              source={item.imageSource}
              style={styles.avatarContainer}
            />
          ) : (
            <View style={[styles.avatarContainer, {backgroundColor: theme.colors.surface, justifyContent: 'center', alignItems: 'center'}]}>
              <Text style={{fontSize: 28}}>{item.avatar}</Text>
            </View>
          )}
          {item.online && <View style={[styles.onlineDot, {backgroundColor: '#10b981'}]} />}
        </View>

        <View style={styles.searchResultContentWrapper}>
          {/* Name with highlight if matched */}
          {hasNameMatch ? (
            renderHighlightedText(item.name, searchQuery, true)
          ) : (
            <Text style={[styles.searchResultName, {color: theme.colors.primaryText}]}>
              {item.name}
            </Text>
          )}
          
          {/* Message with highlight if matched */}
          {hasMessageMatch ? (
            <View style={{marginTop: 4}}>
              <Text style={[styles.searchResultSubtext, {color: theme.colors.secondaryText}]}>
                {renderHighlightedText(item.message, searchQuery, false)}
              </Text>
            </View>
          ) : hasNameMatch ? (
            <Text style={[styles.searchResultSubtext, {color: theme.colors.secondaryText}]}>
              {item.message}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  const displayChats = isSearching || searchQuery.trim().length > 0 ? searchResults : chats;

  return (
    <LinearGradient
      colors={theme.name === 'dark' 
        ? ['#1C120C', '#2A1A12', '#1C120C']
        : ['#fdf3e9', '#fce8d9', '#fdf3e9']
      }
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}
      style={{flex: 1}}>
      <View style={[styles.container]}>
        <StatusBar
          barStyle={theme.name === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor="transparent"
          translucent
        />

      {/* Header with User Avatar and Settings */}
      <View style={[styles.headerContainer, {backgroundColor: theme.name === 'dark' ? 'rgba(26, 26, 26, 0.85)' : 'rgba(253, 243, 233, 0.85)'}]}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.avatarSmall}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.7}>
            <Image
              source={require('../assets/me2.jpeg')}
              style={styles.avatarSmallImage}
            />
          </TouchableOpacity>
          <Text style={[styles.headerBrand, {color: theme.colors.brandAccent}]}>CapChat</Text>
          <TouchableOpacity style={styles.headerSettings} onPress={() => setShowMenu(true)}>
            <Settings size={22} color={theme.colors.brandAccent} />
          </TouchableOpacity>
        </View>

        {/* CHATS MESSAGES Title */}
        <View style={styles.titleContainer}>
          <Text style={[styles.chatsTitle, {color: theme.colors.primaryText}]}>CHATS</Text>
          <Text style={[styles.messagesTitle, {color: theme.colors.secondaryText}]}>MESSAGES</Text>
        </View>

        {/* Search bar */}
        <View style={[styles.searchContainer, {
          backgroundColor: theme.name === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(255, 255, 255, 0.8)',
          borderColor: theme.name === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)',
        }]}>
          <Search size={18} color={theme.colors.secondaryText} />
          <TextInput
            style={[styles.searchInput, {color: theme.colors.primaryText}]}
            placeholder="Search mutuals..."
            placeholderTextColor={theme.colors.secondaryText}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.trim().length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <X size={18} color={theme.colors.secondaryText} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Chat list */}
      <FlatList
        data={displayChats}
        renderItem={isSearching || searchQuery.trim().length > 0 ? renderSearchResult : renderChat}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        scrollIndicatorInsets={{right: 1}}
        ListEmptyComponent={
          searchQuery.trim().length > 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, {color: theme.colors.secondaryText}]}>
                No chats found
              </Text>
            </View>
          ) : null
        }
      />

      {/* Floating action button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowContactsModal(true)}
        activeOpacity={0.75}>
        <LinearGradient
          colors={['#c97068', '#e8745c']}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Edit size={28} color="#fff" strokeWidth={2.5} />
        </LinearGradient>
      </TouchableOpacity>

      {/* Settings Menu Modal */}
      <Modal visible={showMenu} transparent animationType="fade">
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}>
          <View style={[styles.menuContainer, {
            backgroundColor: theme.name === 'dark'
              ? 'rgba(30, 30, 30, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
            borderColor: theme.name === 'dark'
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.1)',
          }]}>
            <TouchableOpacity 
              style={[styles.menuItem, {
                borderBottomColor: theme.name === 'dark'
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.05)',
                borderBottomWidth: 1,
              }]}
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
              style={[styles.menuItem, {
                borderBottomColor: theme.name === 'dark'
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.05)',
                borderBottomWidth: 1,
              }]}
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
              onPress={handleLogout}>
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

      {/* Contacts Modal */}
      <Modal visible={showContactsModal} transparent animationType="slide">
        <View style={[styles.contactsModalContainer, {backgroundColor: theme.colors.mainBackground}]}>
          <LinearGradient
            colors={[theme.colors.headerBg, theme.colors.mainBackground]}
            style={styles.contactsHeader}>
            <TouchableOpacity
              style={styles.contactsBackBtn}
              onPress={() => {
                setShowContactsModal(false);
                setSelectedContact(null);
              }}>
              <ArrowLeft size={24} color={theme.colors.primaryText} />
            </TouchableOpacity>
            <Text style={[styles.contactsHeaderTitle, {color: theme.colors.primaryText}]}>
              New Chat
            </Text>
            <View style={{width: 40}} />
          </LinearGradient>

          <FlatList
            data={contactsData}
            renderItem={renderContactItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.contactsListContent}
            scrollIndicatorInsets={{right: 1}}
          />
        </View>
      </Modal>

      {/* Confirmation Modal */}
      <Modal visible={showConfirmationModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.confirmationOverlay}
          activeOpacity={1}
          onPress={() => setShowConfirmationModal(false)}>
          <View style={[styles.confirmationContainer, {
            backgroundColor: theme.name === 'dark'
              ? 'rgba(30, 30, 30, 0.98)'
              : 'rgba(255, 255, 255, 0.98)',
            borderColor: theme.name === 'dark'
              ? 'rgba(255, 255, 255, 0.15)'
              : 'rgba(0, 0, 0, 0.1)',
          }]}>
            <View style={{alignItems: 'center', marginBottom: 20}}>
              <View style={[styles.confirmationAvatar, {backgroundColor: theme.colors.surface}]}>
                <Text style={styles.confirmationAvatarText}>
                  {selectedContact?.avatar}
                </Text>
              </View>
            </View>

            <Text style={[styles.confirmationTitle, {color: theme.colors.primaryText}]}>
              Start chat with {selectedContact?.name}?
            </Text>
            <Text style={[styles.confirmationMessage, {color: theme.colors.secondaryText}]}>
              You'll be able to send and receive messages
            </Text>

            <View style={styles.confirmationButtonGroup}>
              <TouchableOpacity
                style={[styles.confirmationButton, {backgroundColor: theme.colors.mainBackground, borderColor: theme.colors.borderColor, borderWidth: 1}]}
                onPress={() => setShowConfirmationModal(false)}>
                <Text style={[styles.confirmationButtonText, {color: theme.colors.primaryText}]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmationButton, {backgroundColor: theme.colors.brandAccent}]}
                onPress={handleConfirmNewChat}>
                <Check size={20} color="#fff" />
                <Text style={[styles.confirmationButtonText, {color: '#fff', marginLeft: 8}]}>
                  Start Chat
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarSmall: {
    width: 44,
    height: 44,
    borderRadius: 12,
    overflow: 'hidden',
  },
  avatarSmallImage: {
    width: 44,
    height: 44,
  },
  headerBrand: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 2,
  },
  headerSettings: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    marginBottom: 20,
  },
  chatsTitle: {
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1,
  },
  messagesTitle: {
    fontSize: 42,
    fontWeight: '300',
    letterSpacing: -1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  listContent: {
    paddingTop: 12,
    paddingHorizontal: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 17,
    fontWeight: '600',
  },
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0,
    alignItems: 'center',
    gap: 14,
    marginHorizontal: 4,
    marginVertical: 6,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarText: {
    fontSize: 32,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: '#fdf3e9',
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
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
    flex: 1,
  },
  chatTime: {
    fontFamily: 'System',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 8,
    color: '#a0a0a0',
  },
  chatMessage: {
    fontFamily: 'System',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    opacity: 0.75,
  },
  relevanceLabel: {
    fontFamily: 'System',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  unreadBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    elevation: 0,
    shadowColor: 'transparent',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  unreadText: {
    fontFamily: 'System',
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  searchResultItem: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 0,
    alignItems: 'flex-start',
    gap: 14,
    marginHorizontal: 4,
    marginVertical: 6,
    borderRadius: 18,
  },
  searchResultContentWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  searchResultName: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
  },
  searchResultMessage: {
    fontFamily: 'System',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  },
  searchResultSubtext: {
    fontFamily: 'System',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    opacity: 0.8,
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 28,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-start',
    paddingTop: 60,
    paddingRight: 16,
  },
  menuContainer: {
    alignSelf: 'flex-end',
    borderRadius: 18,
    borderWidth: 0,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.25,
    shadowRadius: 12,
    minWidth: 180,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 0,
  },
  menuIconLeft: {
    marginRight: 14,
  },
  menuText: {
    fontSize: 15,
    fontWeight: '600',
  },
  // Contacts Modal Styles
  contactsModalContainer: {
    flex: 1,
    paddingTop: 40,
  },
  contactsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 18,
  },
  contactsHeaderTitle: {
    fontSize: 22,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  contactsBackBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactsListContent: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  contactItem: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 0,
    alignItems: 'center',
    gap: 14,
    marginHorizontal: 4,
    marginVertical: 6,
    borderRadius: 18,
  },
  contactAvatar: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 0,
    shadowColor: 'transparent',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  contactAvatarText: {
    fontSize: 26,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  // Confirmation Modal Styles
  confirmationOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  confirmationContainer: {
    borderRadius: 28,
    borderWidth: 0,
    paddingHorizontal: 28,
    paddingVertical: 32,
    elevation: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  confirmationAvatar: {
    width: 88,
    height: 88,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 0,
    shadowColor: 'transparent',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  confirmationAvatarText: {
    fontSize: 44,
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },
  confirmationMessage: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 28,
    opacity: 0.8,
  },
  confirmationButtonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  confirmationButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  confirmationButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
