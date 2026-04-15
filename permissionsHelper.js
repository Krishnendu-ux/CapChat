import {Platform} from 'react-native';

// Check if we need to request permissions (Android 6+)
export const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      // For React Native, we would use a package like react-native-permissions
      // For now, we'll just log that permission was requested
      console.log('Camera permission requested (requires react-native-permissions)');
      return true;
    } catch (error) {
      console.error('Camera permission error:', error);
      return false;
    }
  } else if (Platform.OS === 'ios') {
    // iOS permissions handled through Info.plist
    console.log('Camera permission needs to be set in Info.plist');
    return true;
  }
  return true;
};

export const requestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    try {
      console.log('Storage permission requested');
      return true;
    } catch (error) {
      console.error('Storage permission error:', error);
      return false;
    }
  }
  return true;
};

export const requestMicrophonePermission = async () => {
  if (Platform.OS === 'android') {
    try {
      console.log('Microphone permission requested');
      return true;
    } catch (error) {
      console.error('Microphone permission error:', error);
      return false;
    }
  }
  return true;
};
