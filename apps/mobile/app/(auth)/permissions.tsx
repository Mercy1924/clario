import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useCameraPermissions } from 'expo-camera';
// Note: expo-av for microphone, expo-notifications for notifications

export default function PermissionsScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [granted, setGranted] = useState({
    camera: false,
    microphone: false,
    notifications: false,
  });

  const requestCameraPermission = async () => {
    try {
      const { status } = await requestPermission();
      if (status === 'granted') {
        setGranted((prev) => ({ ...prev, camera: true }));
      } else {
        Alert.alert(
          'Camera Required',
          'Clarios needs camera access to capture your space. You can enable it in Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
      }
    } catch (error) {
      console.error('Camera permission error:', error);
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      // In production, use expo-av or expo-media-library
      // This is a placeholder for the actual implementation
      setGranted((prev) => ({ ...prev, microphone: true }));
    } catch (error) {
      console.error('Microphone permission error:', error);
    }
  };

  const requestNotificationPermission = async () => {
    try {
      // In production, use expo-notifications
      // This is a placeholder
      setGranted((prev) => ({ ...prev, notifications: true }));
    } catch (error) {
      console.error('Notification permission error:', error);
    }
  };

  const handleContinue = () => {
    // Camera is required, others are optional
    if (!granted.camera) {
      Alert.alert('Camera Required', 'Please grant camera permission to continue.');
      return;
    }
    router.replace('/(tabs)/index');
  };

  const allRequiredGranted = granted.camera;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Permissions</Text>
        <Text style={styles.subtitle}>
          Clarios needs access to these features to work properly
        </Text>
      </View>

      {/* Camera Permission */}
      <TouchableOpacity
        style={[styles.permissionCard, granted.camera && styles.permissionCardGranted]}
        onPress={requestCameraPermission}
      >
        <View style={styles.permissionIcon}>
          <Text style={styles.permissionEmoji}>📷</Text>
        </View>
        <View style={styles.permissionContent}>
          <Text style={styles.permissionTitle}>Camera</Text>
          <Text style={styles.permissionDescription}>
            Required to capture and analyse your spaces
          </Text>
        </View>
        <View style={styles.permissionStatus}>
          {granted.camera ? (
            <Text style={styles.statusGranted}>✓</Text>
          ) : (
            <Text style={styles.statusPending}>→</Text>
          )}
        </View>
      </TouchableOpacity>

      {/* Microphone Permission */}
      <TouchableOpacity
        style={[styles.permissionCard, granted.microphone && styles.permissionCardGranted]}
        onPress={requestMicrophonePermission}
      >
        <View style={styles.permissionIcon}>
          <Text style={styles.permissionEmoji}>🎤</Text>
        </View>
        <View style={styles.permissionContent}>
          <Text style={styles.permissionTitle}>Microphone</Text>
          <Text style={styles.permissionDescription}>
            For voice-guided sessions and voice descriptions
          </Text>
        </View>
        <View style={styles.permissionStatus}>
          {granted.microphone ? (
            <Text style={styles.statusGranted}>✓</Text>
          ) : (
            <Text style={styles.statusPending}>→</Text>
          )}
        </View>
      </TouchableOpacity>

      {/* Notifications Permission */}
      <TouchableOpacity
        style={[styles.permissionCard, granted.notifications && styles.permissionCardGranted]}
        onPress={requestNotificationPermission}
      >
        <View style={styles.permissionIcon}>
          <Text style={styles.permissionEmoji}>🔔</Text>
        </View>
        <View style={styles.permissionContent}>
          <Text style={styles.permissionTitle}>Notifications</Text>
          <Text style={styles.permissionDescription}>
            Optional reminders to complete your sessions
          </Text>
        </View>
        <View style={styles.permissionStatus}>
          {granted.notifications ? (
            <Text style={styles.statusGranted}>✓</Text>
          ) : (
            <Text style={styles.statusPending}>→</Text>
          )}
        </View>
      </TouchableOpacity>

      {/* Continue Button */}
      <TouchableOpacity
        style={[styles.continueButton, !allRequiredGranted && styles.continueButtonDisabled]}
        onPress={handleContinue}
        disabled={!allRequiredGranted}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>

      <View style={styles.bottomPadding} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  permissionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e5e5e5',
  },
  permissionCardGranted: {
    borderColor: '#4CAF50',
    backgroundColor: '#f0fff0',
  },
  permissionIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#f0f0f0',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionEmoji: {
    fontSize: 24,
  },
  permissionContent: {
    flex: 1,
    marginLeft: 12,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  permissionDescription: {
    fontSize: 13,
    color: '#666',
  },
  permissionStatus: {
    width: 32,
    alignItems: 'center',
  },
  statusGranted: {
    fontSize: 20,
    color: '#4CAF50',
    fontWeight: '700',
  },
  statusPending: {
    fontSize: 18,
    color: '#999',
  },
  continueButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 24,
  },
  continueButtonDisabled: {
    backgroundColor: '#ccc',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});
