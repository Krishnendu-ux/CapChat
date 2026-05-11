import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
  StatusBar,
  Image,
  Modal,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../ThemeContext';
import chatAPI from '../api';
import { Send, Smile, Camera, X, ArrowLeft, Phone, Video, MoreVertical, Mic } from 'lucide-react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useRef } from 'react';

export default function ChatDetailScreen({route, navigation}) {
  const {name, id, onMessageSent, onVibeUpdate} = route.params;
  const {theme} = useTheme();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [viewingPhoto, setViewingPhoto] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [currentVibe, setCurrentVibe] = useState("vibing rn ✨");
  const [showVibeModal, setShowVibeModal] = useState(false);
  const [capMode, setCapMode] = useState(false);
  const [userVotes, setUserVotes] = useState({}); 

  // Avatar image mapping
  const avatarMap = {
    'Ravi': require('../assets/ravi.jpeg'),
    'Raju': require('../assets/raju.png'),
    'The Squad': require('../assets/the squad.jpeg'),
    'Mom ❤️': require('../assets/mom.jpeg'),
  };

  const contactAvatar = avatarMap[name] || null;

  const vibeOptions = [
    "delulu era 🌀",
    "touching grass 🌿",
    "in my villain arc 😈",
    "rizzing up 🔥",
    "overstimulated af ⚡",
    "serving looks ✨",
    "main character energy 🎥",
    "certified yapper 🗣️",
    "healing era 🫂",
    "ghosting duties 👻",
    "in my feels rn 🥺"
  ];

  useEffect(() => {
    loadMessages();
  }, [id]);

  useEffect(() => {
    // Mark all messages as read when screen is opened
    if (messages.length > 0) {
      const unreadMessageIds = messages
        .filter(msg => !msg.isRead && msg.sender !== 'me')
        .map(msg => msg.id);
      
      if (unreadMessageIds.length > 0) {
        markMessagesAsRead(unreadMessageIds);
      }
    }
  }, [id]);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    if (messages.length > 0) {
    }
  }, [messages]);

  const capCache = useRef({}); // Will store Cap data persistently
  const loadMessages = async () => {
    try {
      setLoading(true);
      const fetchedMessages = await chatAPI.fetchMessages(id);
      setMessages(fetchedMessages);   // Simple - no merge for now
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCameraPress = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    // Try to launch camera first
    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('Camera cancelled');
      } else if (response.errorCode) {
        // If camera fails, fallback to gallery
        launchImageLibrary(options, galleryResponse => {
          if (!galleryResponse.didCancel && !galleryResponse.errorCode) {
            const source = galleryResponse.assets[0].uri;
            setSelectedPhoto(source);
          }
        });
      } else {
        const source = response.assets[0].uri;
        setSelectedPhoto(source);
      }
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAttitudeReceipt = (item) => {
    if (item.sender !== 'me') {
      return formatTime(item.timestamp);
    }

    // Don't show funny status on very old messages or messages that have replies
    if (item.hasReply || Date.now() - new Date(item.timestamp).getTime() > 3600000) { 
      return formatTime(item.timestamp); // Show normal time for old messages
    }

    const rand = Math.random();
    
    if (rand > 0.7) return "Left on read 💀";
    if (rand > 0.45) return "Seen by the delusions 👀";
    if (rand > 0.25) return "Delivered fr ✨";
    return "Just now";
  };

  const formatRecordingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    
    const newMessage = {
      id: 'voice-' + Date.now().toString(),   // ← Better unique ID
      sender: 'me',
      text: `Voice message (${formatRecordingTime(recordingTime)})`,
      timestamp: new Date(),
      isVoice: true,
    };
    
    setMessages([...messages, newMessage]);
    setRecordingTime(0);
  };

  const handleCallPress = () => {
    alert('📞 Starting voice call with ' + name);
  };

  const handleVideoCallPress = () => {
    alert('📹 Starting video call with ' + name);
  };

  const handleCapVote = (messageId, voteType) => {
    setMessages(prevMessages => 
      prevMessages.map(msg => {
        if (msg.id === messageId && msg.isCap) {
          if (msg.userVoted) {
            alert("You've already voted! 👀");
            return msg;
          }

          const current = msg.capVotes || { cap: 0, noCap: 0 };
          const updatedMsg = {
            ...msg,
            capVotes: {
              ...current,
              [voteType]: current[voteType] + 1
            },
            userVoted: voteType
          };

          // Save to cache
          capCache.current[messageId] = {
            capVotes: updatedMsg.capVotes,
            userVoted: voteType
          };

          return updatedMsg;
        }
        return msg;
      })
    );
  };

const sendMessage = async () => {
  if (!inputText.trim() && !selectedPhoto) return;

  try {
    const newMessageFromAPI = await chatAPI.sendMessage(id, inputText, selectedPhoto);
    
    const finalMessage = {
      ...newMessageFromAPI,
      id: 'msg-' + Date.now().toString(),
      isCap: capMode,
      capVotes: capMode ? { cap: 0, noCap: 0 } : undefined,
      userVoted: null
    };

    setMessages(prev => [...prev, finalMessage]);
    setInputText('');
    setSelectedPhoto(null);
    setCapMode(false);

    if (route.params?.onMessageSent) {
      route.params.onMessageSent(finalMessage);
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

  const renderMessage = ({item}) => {
    const isCap = item.isCap || false;

    return (
      <View style={[styles.messageContainer, item.sender === 'me' ? styles.myMessage : styles.otherMessage]}>
        {/* ... photo part same ... */}

        {item.text && (
          <TouchableOpacity 
            onLongPress={() => isCap && handleCapVote(item.id)}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={item.sender === 'me' ? [theme.colors.sentBubbleStart, theme.colors.sentBubbleEnd] : [theme.colors.receivedBubble, theme.colors.receivedBubble]}
              style={[
                styles.messageBubble,
                isCap && styles.capMessageBorder,
                item.sender === 'me' ? {borderTopRightRadius: 4} : {borderTopLeftRadius: 4, borderWidth: 1, borderColor: theme.colors.receivedBubbleBorder},
              ]}>
              
              {isCap && <Text style={styles.capLabel}>🔥 CAP MODE</Text>}
              
              <Text style={[styles.messageText, {color: item.sender === 'me' ? '#fff' : theme.colors.primaryText}]}>
                {item.text}
              </Text>
              
              <Text style={[styles.messageTime, {color: item.sender === 'me' ? 'rgba(255,255,255,0.65)' : theme.colors.secondaryText}]}>
                {getAttitudeReceipt(item)}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Voting UI */}
        {isCap && (
          <View style={styles.capVotesContainer}>
            <TouchableOpacity 
              style={[styles.capVoteBtn, {backgroundColor: theme.colors.surface, borderColor: theme.colors.borderColor}, item.userVoted === 'cap' && styles.myVoteStyle]}
              onPress={() => handleCapVote(item.id, 'cap')}
              disabled={!!item.userVoted}>
              <Text style={[styles.capVoteText, {color: theme.colors.primaryText}]}>
                Cap 🔥 ({item.capVotes?.cap || 0})
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.capVoteBtn, {backgroundColor: theme.colors.surface, borderColor: theme.colors.borderColor}, item.userVoted === 'noCap' && styles.myVoteStyle]}
              onPress={() => handleCapVote(item.id, 'noCap')}
              disabled={!!item.userVoted}>
              <Text style={[styles.capVoteText, {color: theme.colors.primaryText}]}>
                No Cap ✅ ({item.capVotes?.noCap || 0})
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, {backgroundColor: theme.colors.mainBackground}]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'none'}>
      <View style={{flex: 1, backgroundColor: theme.colors.mainBackground}}>
      <StatusBar
        barStyle={theme.name === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.headerBg}
      />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={theme.colors.brandAccent}
          />
          <Text style={[styles.loadingText, {color: theme.colors.secondaryText}]}>
            loading messages...
          </Text>
        </View>
      ) : (
        <>
          {/* Header */}
          <LinearGradient
            colors={[theme.colors.headerBg, theme.colors.headerBgSecondary]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.headerGradient}>
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backBtn}
                onPress={() => navigation.goBack()}>
                <ArrowLeft size={24} color={theme.colors.primaryText} />
              </TouchableOpacity>

              {contactAvatar && (
                <Image
                  source={contactAvatar}
                  style={styles.headerAvatar}
                />
              )}

              <View style={styles.headerInfo}>
                <Text style={[styles.headerName, {color: theme.colors.primaryText}]}>
                  {name}
                </Text>
                <Text style={[styles.headerStatus, {color: theme.colors.brandAccent, fontWeight: '600', fontSize: 13}]}>
                  {currentVibe}
                </Text>
              </View>

              <View style={styles.headerActions}>
                <TouchableOpacity 
                  style={styles.actionIconBtn}
                  onPress={handleVideoCallPress}>
                  <Video size={20} color={theme.colors.brandAccent} />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionIconBtn}
                  onPress={handleCallPress}>
                  <Phone size={20} color={theme.colors.brandAccent} />
                </TouchableOpacity>

                {/* Vibe Button - Better Position */}
                <TouchableOpacity 
                  style={styles.actionIconBtn}
                  onPress={() => setShowVibeModal(true)}>
                  <Text style={{fontSize: 24}}>🌟</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.actionIconBtn}
                  onPress={() => setShowMenu(!showMenu)}>
                  <MoreVertical size={20} color={theme.colors.brandAccent} />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>

          {/* Menu Modal */}
          {showMenu && (
            <View style={[styles.menuDropdown, {backgroundColor: theme.colors.surface, borderColor: theme.colors.borderColor}]}>
              <TouchableOpacity 
                style={[styles.menuItem, {borderBottomColor: theme.colors.borderColor}]}
                onPress={() => {
                  alert('View contact info');
                  setShowMenu(false);
                }}>
                <Text style={[styles.menuText, {color: theme.colors.primaryText}]}>Contact Info</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.menuItem, {borderBottomColor: theme.colors.borderColor}]}
                onPress={() => {
                  alert('Mute notifications');
                  setShowMenu(false);
                }}>
                <Text style={[styles.menuText, {color: theme.colors.primaryText}]}>Mute Notifications</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  alert('Clear chat history');
                  setShowMenu(false);
                }}>
                <Text style={[styles.menuText, {color: theme.colors.destructive}]}>Clear Chat</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Messages List */}
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id?.toString() || Math.random().toString()}
            contentContainerStyle={messages.length === 0 ? styles.emptyMessageList : styles.messageList}
            inverted={false}
            scrollEnabled={!isRecording}
            ListEmptyComponent={
              <View style={styles.emptyMessagesContainer}>
                <Text style={[styles.emptyMessagesText, {color: theme.colors.secondaryText}]}>
                  No messages yet
                </Text>
                <Text style={[styles.emptyMessagesSubtext, {color: theme.colors.secondaryText}]}>
                  Start a conversation! 👋
                </Text>
              </View>
            }
          />
          {selectedPhoto && (
            <View style={[styles.photoPreview, {backgroundColor: theme.colors.surface}]}>
              <Image
                source={{uri: selectedPhoto}}
                style={styles.photoThumbnail}
              />
              <TouchableOpacity
                style={styles.removePhotoBtn}
                onPress={() => setSelectedPhoto(null)}>
                <X size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          {/* Voice Recording Indicator */}
          {isRecording && (
            <View style={[styles.recordingIndicator, {backgroundColor: theme.colors.surface, borderTopColor: theme.colors.borderColor}]}>
              <View style={styles.recordingDot} />
              <Text style={[styles.recordingText, {color: theme.colors.brandAccent}]}>
                Recording... {formatRecordingTime(recordingTime)}
              </Text>
            </View>
          )}

          {/* Input Area */}
          <View
            style={[
              styles.inputContainer,
              {
                borderTopColor: theme.colors.borderColor,
                backgroundColor: theme.colors.surface,
              },
            ]}>
            
            <TouchableOpacity style={styles.iconBtn} onPress={handleCameraPress}>
              <Camera size={20} color={theme.colors.brandAccent} />
            </TouchableOpacity>

            {/* 🔥 Cap Mode Toggle */}
            <TouchableOpacity 
              style={[styles.capToggle, capMode && styles.capToggleActive]}
              onPress={() => setCapMode(!capMode)}>
              <Text style={styles.capText}>🔥 Cap</Text>
            </TouchableOpacity>

            {!isRecording ? (
              <>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: theme.colors.borderColor,
                      color: theme.colors.primaryText,
                      backgroundColor: theme.colors.mainBackground,
                    },
                  ]}
                  placeholderTextColor={theme.colors.secondaryText}
                  placeholder="yo, what's up?"
                  value={inputText}
                  onChangeText={setInputText}
                  multiline
                  maxLength={500}
                  editable={!isRecording}
                />

                <TouchableOpacity style={styles.iconBtn}>
                  <Smile size={20} color={theme.colors.brandAccent} />
                </TouchableOpacity>
                
                {/* Send or Voice Button */}
                {(inputText.trim() || selectedPhoto) ? (
                  <TouchableOpacity
                    style={[styles.sendButton, {backgroundColor: theme.colors.brandAccent}]}
                    onPress={sendMessage}
                    activeOpacity={0.75}>
                    <Send size={20} color="#fff" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.voiceButton, {backgroundColor: theme.colors.brandAccent}]}
                    onPress={handleStartRecording}
                    activeOpacity={0.75}>
                    <Mic size={20} color="#fff" />
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <>
                <View style={styles.recordingFlexSpace} />
                <TouchableOpacity
                  style={[styles.stopRecordingButton, {backgroundColor: theme.colors.destructive}]}
                  onPress={handleStopRecording}
                  activeOpacity={0.75}>
                  <Text style={styles.stopRecordingText}>Send</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Photo Viewer Modal */}
          <Modal visible={!!viewingPhoto} transparent animationType="fade">
            <TouchableOpacity
              style={styles.photoViewerOverlay}
              activeOpacity={1}
              onPress={() => setViewingPhoto(null)}>
              <Image
                source={{uri: viewingPhoto}}
                style={styles.fullscreenPhoto}
              />
            </TouchableOpacity>
          </Modal>
        </>
      )}
      </View>
      {/* Vibe Selector Modal */}
      <Modal 
        visible={showVibeModal} 
        transparent 
        animationType="slide"
      >
        <View style={styles.vibeModalOverlay}>
          <View style={[styles.vibeModalContent, {backgroundColor: theme.colors.surface, borderColor: theme.colors.borderColor}]}>
            
            <Text style={[styles.vibeModalTitle, {color: theme.colors.primaryText}]}>
              What's your vibe today?
            </Text>

            <FlatList
              data={vibeOptions}
              keyExtractor={item => item.id?.toString() || Math.random().toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[styles.vibeOption, {borderBottomColor: theme.colors.borderColor}]}
                  onPress={() => {
                    setCurrentVibe(item);
                    setShowVibeModal(false);
                    
                    // Update in Chat List as well
                    if (onVibeUpdate) {
                      onVibeUpdate(item);
                    }
                    
                    alert(`Vibe updated → ${item} 🔥`);
                  }}>
                  <Text style={[styles.vibeOptionText, {color: theme.colors.primaryText}]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity 
              style={styles.closeVibeBtn}
              onPress={() => setShowVibeModal(false)}>
              <Text style={{color: theme.colors.brandAccent, fontSize: 16, fontWeight: '600'}}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'System',
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  messageList: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  messageContainer: {
    marginVertical: 6,
    maxWidth: '85%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    marginRight: 8,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    marginLeft: 8,
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  messageText: {
    fontFamily: 'System',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 20,
  },
  messageTime: {
    fontFamily: 'System',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '400',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    alignItems: 'flex-end',
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    fontFamily: 'System',
    flex: 1,
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: '500',
    maxHeight: 100,
  },
  sendButton: {
    borderRadius: 50,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  voiceButton: {
    borderRadius: 50,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerGradient: {
    paddingTop: 32,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  backBtn: {
    padding: 8,
    marginLeft: -8,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerName: {
    fontFamily: 'Georgia',
    fontSize: 16,
    fontWeight: '700',
  },
  headerStatus: {
    fontFamily: 'System',
    fontSize: 12,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  actionIconBtn: {
    padding: 8,
  },
  menuDropdown: {
    position: 'absolute',
    top: 60,
    right: 16,
    borderRadius: 12,
    borderWidth: 1,
    zIndex: 100,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minWidth: 180,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  menuText: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '500',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    gap: 12,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF4444',
    opacity: 0.8,
  },
  recordingText: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '600',
  },
  recordingFlexSpace: {
    flex: 1,
  },
  stopRecordingButton: {
    borderRadius: 50,
    width: 60,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  stopRecordingText: {
    fontFamily: 'System',
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  photoPreview: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  photoThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removePhotoBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoViewerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenPhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  messagePhoto: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 6,
  },
  emptyMessageList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessagesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyMessagesText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyMessagesSubtext: {
    fontSize: 14,
    fontWeight: '500',
  },
  vibeModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  vibeModalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '65%',
    borderWidth: 1,
  },
  vibeModalTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
  },
  vibeOption: {
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  vibeOptionText: {
    fontSize: 17,
    fontWeight: '500',
  },
  closeVibeBtn: {
    marginTop: 15,
    paddingVertical: 16,
    alignItems: 'center',
  },
  capToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#1f1f1f',
    marginRight: 6,
    borderWidth: 1.5,
    borderColor: '#ff4444',
  },
  capToggleActive: {
    backgroundColor: '#ff4444',
  },
  capText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  capMessageBorder: {
    borderWidth: 2.5,
    borderColor: '#ff4444',
    borderStyle: 'dashed',
  },
  capLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ff4444',
    marginBottom: 4,
  },
  capVotesContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
    marginLeft: 12,
  },
  capVoteBtn: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  capVoteText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
  },
  myVoteStyle: {
    borderColor: '#ff4444',
    borderWidth: 2,
    backgroundColor: '#ff444420',
  },
});
